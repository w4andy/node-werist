'use strict';

const util = require('util');
const net = require('net');
const Address4 = require('ip-address').Address4;
const Address6 = require('ip-address').Address6;
const puncode = require('punycode');
const Iconv = require('iconv').Iconv;
const tldjs = require('tldjs');
const Socks = require('socks');

const _serverOptions = require('../etc/server.json');
const _tldOptions = require('../etc/tld.json');
const _ip4Range = require('../etc/ip_range.json');
const _ip6Range = require('../etc/ip6_range.json');

class Werist {

  /**
   * get the whois server for the domain
   *
   * @param {String} domain
   * @return {String|null}
   * @private
   */
  _getServerForTld(domain) {
    let tmp = domain.split(/\./);
    while (tmp.length) {
      tmp.shift();
      const ttmp = tmp.join('.');
      if (_tldOptions[ttmp] !== undefined) {
        return _tldOptions[ttmp];
      }
    }
    return null;
  }

  /**
   * get the whois server for the ip address
   *
   * @param {String} address
   * @param {Number} ipVersion
   * @return {String|null}
   * @private
   */
  _setServerForIP(address, ipVersion) {
    const Address = ipVersion === 6 ? Address6 : Address4;
    const rangeData = ipVersion === 6 ? _ip6Range : _ip4Range;

    const ipAddress = new Address(address);

    for (let i = 0; i < rangeData.length; i++) {
      if (ipAddress.isInSubnet(new Address(rangeData[i].range))) {
        return rangeData[i].server;
      }
    }
    return null;
  }

  /**
   * get the server config
   *
   * @param {String} address
   * @param {Object} options
   * @return {Object}
   * @private
   */
  _getServerConfig(address, options) {
    let server = null;
    let port = null;
    let ipAddressVersion = net.isIP(address);
    if (options.server) {
      if (/:/.test(options.server)) {
        let tmp = options.server.split(/:/);
        if (tmp.length > 2) {
          throw new Error('invalid server');
        }
        server = puncode.toASCII(tmp[0]);
        port = parseInt(tmp[1]);
      } else {
        server = options.server;
      }
    } else {
      if (ipAddressVersion) {
        if (ipAddressVersion === 6) {
          const ipAddress = new Address6(address);
          if (ipAddress.is4()) {
            address = ipAddress.to4().correctForm();
            ipAddressVersion = 4;
          }
        }
        server = this._setServerForIP(address, ipAddressVersion);
        if (!server) {
          server = 'whois.arin.net';
        }
      } else {
        server = this._getServerForTld(address);
        if (!server) {
          server = 'whois.iana.org';
        }
      }
    }

    if (!server) {
      throw new Error('no whois server is known for this kind of object');
    }

    let serverConfig = {
      host: server,
      port: port || 43,
      charset: 'utf-8',
      punycode: true,
      query: null,
      queryType: null,
      domainQuery: '$addr\r\n',
      ipQuery: '$addr\r\n',
      address: address
    };

    if (_serverOptions[server] !== undefined) {
      const entry = _serverOptions[server];
      if (entry.port) {
        serverConfig.port = port || entry.port;
      }
      if (entry.charset) {
        serverConfig.charset = entry.charset;
      }
      if (util.isBoolean(entry.punycode)) {
        serverConfig.punycode = entry.punycode;
      }
      if (entry.query) {
        serverConfig.query = entry.query;
      } else if (entry.domainQuery) {
        serverConfig.domainQuery = entry.domainQuery;
      } else if (entry.ipQuery) {
        serverConfig.ipQuery = entry.ipQuery;
      }
    }

    if (!serverConfig.query) {
      serverConfig.query = ipAddressVersion ? serverConfig.ipQuery : serverConfig.domainQuery;
    }
    serverConfig.queryType = ipAddressVersion ? Werist.QUERY_TYPE_IP_ADDRESS : Werist.QUERY_TYPE_DOMAIN;

    return serverConfig;
  }

  /**
   * @callback Werist~lookupCallback
   * @param {Error} [error]
   * @param {Array|String} [whoisData]
   */

  /**
   * lookup domain or ip address
   *
   * @param {String} address  domain or ip address
   * @param {Object} [opt_options]
   * @param {Werist~lookupCallback} callback
   * @return {Werist~lookupCallback}
   */
  lookup(address, opt_options, callback) {
    if (util.isFunction(opt_options)) {
      callback = opt_options;
      opt_options = {};
    }
    let options = {proxy: null}, server;
    options.server = opt_options.server || null;
    options.follow = opt_options.follow || 2;
    options.timeout = util.isNumber(opt_options.timeout) ? opt_options.timeout : 30;
    options.verbose = util.isBoolean(opt_options.verbose) ? opt_options.verbose : false;
    options.bind = opt_options.bind || null;
    options.redirectData = opt_options.redirectData || [];

    if (util.isObject(opt_options.proxy) && opt_options.proxy.ipaddress && opt_options.proxy.port) {
      if (!net.isIP(opt_options.proxy.ipaddress)) {
        return callback(new Error('invalid proxy ip address'));
      }
      options.proxy = {
        ipaddress: opt_options.proxy.ipaddress,
        port: parseInt(opt_options.proxy.port),
        type: opt_options.proxy.type || 5
      };
    }

    const _done = () => {
      if (options.verbose === true) {
        return callback(null, options.redirectData);
      }

      callback(null, options.redirectData.length > 1 ? options.redirectData.join('\n') : options.redirectData[0]);
    };

    try {
      server = this._getServerConfig(address, options);
    } catch (e) {
      return callback(e);
    }

    if (!tldjs.tldExists(server.host)) {
      return _done();
    }

    if (server.queryType === Werist.QUERY_TYPE_IP_ADDRESS && address !== server.address) {
      address = server.address;
    }

    let connectOptions = {
      host: server.host,
      port: server.port
    };

    if (options.bind) {
      connectOptions.localAddress = options.bind;
    }

    // some rwhois don't work
    const isRwhois = /^rwhois/.test(server.host) || server.port === 4321;

    const _lookup = (socket) => {
      let idn = address;
      if (server.queryType === Werist.QUERY_TYPE_DOMAIN && server.punycode === true) {
        idn = puncode.toASCII(idn);
      }
      socket.write(server.query.replace(/\$addr/, idn));

      if (server.charset === 'utf-8') {
        socket.setEncoding(server.charset);
      }

      if (isRwhois) {
        options.timeout = 2;
      }
      socket.setTimeout(options.timeout * 1000);

      socket.on('timeout', () => {
        socket.destroy();

        if (isRwhois) {
          return _done();
        }
        callback(new Error('whois lookup timeout'));
      });
      socket.on('error', (err) => {
        if (isRwhois) {
          return _done();
        }
        return callback(err);
      });

      let data = '', readStream = socket;

      if (server.charset !== 'utf-8') {
        const iconv = new Iconv(server.charset, 'utf-8');
        socket.pipe(iconv);
        readStream = iconv;
      }

      readStream.on('data', (chunk) => {
        data += chunk;
      });
      readStream.once('end', () => {
        const isIana = server.host === 'whois.iana.org';

        // the iana is only needed if we don't know the whois server for this TLD
        // don't add the output to the response and follow the ReferralServer
        if (!isIana) {
          if (options.verbose === true) {
            options.redirectData.push({
              server: {
                host: server.host,
                port: server.port,
                query: server.query
              },
              data: data
            });
          } else {
            options.redirectData.push(data);
          }
        } else {
          options.follow++;
        }

        if (options.follow > 0) {
          const lines = data.split(/\n/);
          for (let i = 0; i < lines.length; i++) {
            if (isIana) {
              const match = lines[i].trim().match(/(refer):\s*(whois.+)/i);
              if (match && match.length === 3 && match[2] !== server.host && match[2] !== server.host + ':' + server.port) {
                options.follow--;
                options.server = match[2];
                return this.lookup(address, options, callback);
              }
            }
            const match = lines[i].trim().match(/(ReferralServer|Registrar Whois|Whois Server):\s*(r?whois:\/\/)?(.+)/i);
            if (match && match.length === 4 && match[3] !== server.host && match[3] !== server.host + ':' + server.port) {
              options.follow--;
              options.server = match[3];
              return this.lookup(address, options, callback);
            }
          }
        }

        _done();
      });
    };

    if (options.proxy) {
      Socks.createConnection({proxy: options.proxy, target: connectOptions}, (err, socket) => {
        if (err) {
          return callback(err);
        }
        _lookup(socket);
        socket.resume();
      });
    } else {
      const socket = net.createConnection(connectOptions);
      socket.once('connect', () => {
        return _lookup(socket);
      });
    }
  }
}

module.exports = Werist;


Werist.QUERY_TYPE_DOMAIN = 'DOMAIN';
Werist.QUERY_TYPE_IP_ADDRESS = 'IP_ADDRESS';
