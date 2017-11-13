'use strict';

const net = require('net');
const Address4 = require('ip-address').Address4;
const Address6 = require('ip-address').Address6;
const puncode = require('punycode');
const Iconv = require('iconv').Iconv;
const tldjs = require('tldjs');
const Socks = require('socks');
const detectCharacterEncoding = require('detect-character-encoding');

const _serverOptions = require('../etc/server.json');
const _tldOptions = require('../etc/tld.json');
const _ip4Range = require('../etc/ip_range.json');
const _ip6Range = require('../etc/ip6_range.json');

class Werist {

  /**
   * the lookup options
   *
   * @typedef {Object} Werist~lookupOptions
   * @property {String} [server]
   * @property {Number} [follow]
   * @property {Number} [timeout]
   * @property {Boolean} [verbose]
   * @property {String} [bind]
   * @property {Werist~lookupProxyOptions|null} [proxy]
   */

  /**
   * the proxy options
   *
   * @typedef {Object} Werist~lookupProxyOptions
   * @property {String} ipaddress
   * @property {Number} port
   * @property {Number} type
   */

  /**
   * get server config response
   *
   * @typedef {Object} Werist~serverConfig
   * @property {String} host
   * @property {Number} port
   * @property {Boolean} punycode
   * @property {String} query
   * @property {String} queryType
   * @property {String} domainQuery
   * @property {String} ipQuery
   */

  /**
   * followingData
   *
   * @typedef {Object} Werist~followingData
   * @property {String} data
   * @property {Object} server
   * @property {String} server.host
   * @property {Number} server.port
   * @property {String} server.query
   */

  /**
   * context object
   *
   * @typedef {Object} Werist~context
   * @property {String} address  ip address, domain
   * @property {Werist~lookupOptions} options
   * @property {Werist~serverConfig} [serverConfig]
   * @property {String[]} [searchIpWhois]
   * @property {Number} following
   * @property {String} [followingServer]
   * @property {Werist~followingData[]|String[]} followingData
   * @property {Werist~followingData|String} [firstData]
   */

  constructor() {
    const keys = Object.keys(Werist.IP_WHOIS_SERVER);
    this._ipServerMapper = {};
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      this._ipServerMapper[Werist.IP_WHOIS_SERVER[key]] = key;
    }
  }

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
   * @param {Werist~context} ctx
   * @private
   */
  _getServerConfig(ctx) {
    let server = null;
    let port = null;
    let ipAddressVersion = net.isIP(ctx.address);
    let customServer = ctx.options.server;
    if (ctx.followingServer && typeof ctx.followingServer === 'string' && ctx.followingServer.length) {
      customServer = ctx.followingServer;
    }
    if (customServer) {
      if (/:/.test(customServer)) {
        let tmp = customServer.split(/:/);
        if (tmp.length > 2) {
          throw new Error('invalid server');
        }
        server = puncode.toASCII(tmp[0]);
        port = parseInt(tmp[1]);
      } else {
        server = customServer;
      }
    } else {
      if (ipAddressVersion) {
        if (ipAddressVersion === 6) {
          const ipAddress = new Address6(ctx.address);
          if (ipAddress.is4()) {
            ctx.address = ipAddress.to4().correctForm();
            ipAddressVersion = 4;
          }
        }
        server = this._setServerForIP(ctx.address, ipAddressVersion);
        if (!server) {
          server = 'whois.arin.net';
        }
      } else {
        server = this._getServerForTld(ctx.address);
        if (!server) {
          ctx.following--;
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
      punycode: true,
      query: null,
      queryType: null,
      domainQuery: '$addr\r\n',
      ipQuery: '$addr\r\n'
    };

    if (_serverOptions[server] !== undefined) {
      const entry = _serverOptions[server];
      if (entry.port) {
        serverConfig.port = port || entry.port;
      }
      if (typeof entry.punycode === 'boolean') {
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

    ctx.serverConfig = serverConfig;
  }

  /**
   * make the lookup
   *
   * @param {Werist~context} ctx
   * @param {Werist~lookupCallback} callback
   * @return {Werist~lookupCallback}
   * @private
   */
  _lookup(ctx, callback) {

    const _done = () => {
      if (ctx.options.verbose === true) {
        return callback(null, ctx.followingData);
      }

      callback(null, ctx.followingData.length > 1 ? ctx.followingData.join('\n') : ctx.followingData[0]);
    };

    try {
      this._getServerConfig(ctx);
    } catch (e) {
      return callback(e);
    }

    if (!tldjs.tldExists(ctx.serverConfig.host)) {
      return _done();
    }

    let connectOptions = {
      host: ctx.serverConfig.host,
      port: ctx.serverConfig.port
    };

    if (ctx.options.bind) {
      connectOptions.localAddress = ctx.options.bind;
    }

    // some rwhois don't work
    const isRwhois = /^rwhois/.test(connectOptions.host) || connectOptions.port === 4321;

    const _lookup = (socket) => {
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

      let timeout = ctx.options.timeout;
      if (isRwhois) {
        timeout = 2;
      }
      socket.setTimeout(timeout * 1000);

      let idn = ctx.address;
      if (ctx.serverConfig.queryType === Werist.QUERY_TYPE_DOMAIN && ctx.serverConfig.punycode === true) {
        idn = puncode.toASCII(idn);
      }
      socket.write(ctx.serverConfig.query.replace(/\$addr/, idn));

      let chunks = [];
      socket.on('data', (chunk) => {
        chunks.push(chunk);
      });
      socket.once('end', () => {
        let buffer = null;
        if (chunks.length) {
          buffer = Buffer.concat(chunks);
        }

        let charsetMatch = null;
        if (buffer) {
          charsetMatch = detectCharacterEncoding(buffer);
        }

        if (charsetMatch && charsetMatch.encoding !== 'UTF-8') {
          const iconv = new Iconv(charsetMatch.encoding, 'utf-8');
          buffer = iconv.convert(buffer);
        }

        let data = '';
        if (buffer) {
          data = buffer.toString();
        }
        const _addWhoIsData = (firstData) => {
          if (firstData === true) {
            if (ctx.options.verbose === true) {
              ctx.firstData = {
                server: {
                  host: ctx.serverConfig.host,
                  port: ctx.serverConfig.port,
                  query: ctx.serverConfig.query
                },
                data: data
              };
            } else {
              ctx.firstData = data;
            }
          } else {
            if (ctx.options.verbose === true) {
              ctx.followingData.push({
                server: {
                  host: ctx.serverConfig.host,
                  port: ctx.serverConfig.port,
                  query: ctx.serverConfig.query
                },
                data: data
              });
            } else {
              ctx.followingData.push(data);
            }
          }
        };

        let follow = ctx.following < ctx.options.follow;

        // domain queries follow only verisign-grs.com and iana whois server
        if (follow && ctx.serverConfig.queryType === Werist.QUERY_TYPE_DOMAIN && !/(verisign-grs\.com|iana\.org)/.test(ctx.serverConfig.host)) {
          follow = false;
        }

        if (follow) {
          const lines = data.split(/\n/);
          const isIpWhoisServer = ctx.serverConfig.queryType === Werist.QUERY_TYPE_IP_ADDRESS && (ctx.following === 0 || ctx.following === 1 && ctx.followingData[0].server.host === Werist.IP_WHOIS_SERVER.arin);
          let iNetNumFound = !isIpWhoisServer;
          if (isIpWhoisServer && isRwhois) {
            iNetNumFound = true;
          }
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (ctx.serverConfig.host === 'whois.iana.org') {
              const match = line.trim().match(/(refer|whois):\s*(whois.+)/i);
              if (match && match.length === 3 && match[2] !== ctx.serverConfig.host && match[2] !== ctx.serverConfig.host + ':' + ctx.serverConfig.port) {
                ctx.following++;
                ctx.followingServer = match[2];
                return this._lookup(ctx, callback);
              }
              if (line.trim() === '% This query returned 0 objects.') {
                return _done();
              }
            }

            // check the resource for ip whois server eq. "% LACNIC resource: whois.lacnic.net"
            if (isIpWhoisServer && line.substr(0, 1) === '%' && /%\s+\w+\s+resource:\s+(whois\.)/.test(line)) {
              let nicMatch = line.trim().match(/%\s+\w+\s+resource:\s+(whois\..+)/);
              if (nicMatch && nicMatch[1] && nicMatch[1] !== ctx.serverConfig.host && this._ipServerMapper[nicMatch[1]] !== undefined) {
                ctx.followingServer = nicMatch[1];
                return this._lookup(ctx, callback);
              }
            }

            if (isIpWhoisServer && !iNetNumFound) {
              iNetNumFound = /(inetnum|inet6num|netrange)/i.test(line);
            } else if (isIpWhoisServer && iNetNumFound && /netname:\s+(NON-RIPE-NCC-MANAGED-ADDRESS-BLOCK)/i.test(line)) {
              iNetNumFound = false;
            } else if (isIpWhoisServer && iNetNumFound && /nettype:\s+early registrations, maintained by arin/i.test(line)) {
              iNetNumFound = false;
            } else if (iNetNumFound && !iNetNumFound && /(quota exceeded|query rate limit exceeded)/i.test(line)) {
              iNetNumFound = true;
            }

            const match = line.trim().match(/(^ReferralServer|Registrar Whois|Whois Server):\s*(r?whois:\/\/)?(.+)/i);
            if (match && match.length === 4 && match[3] !== ctx.serverConfig.host && match[3] !== ctx.serverConfig.host + ':' + ctx.serverConfig.port) {
              ctx.following++;
              ctx.followingServer = match[3];
              _addWhoIsData(false);
              return this._lookup(ctx, callback);
            }
          }
          if (isIpWhoisServer && !iNetNumFound) {
            if (ctx.following > 0) {
              ctx.following = 0;
              ctx.followingData = [];
            }
            if (!ctx.searchIpWhois) {
              ctx.searchIpWhois = Object.keys(Werist.IP_WHOIS_SERVER);
              ctx.searchIpWhois.splice(ctx.searchIpWhois.indexOf(this._ipServerMapper[ctx.serverConfig.host]), 1);
              ctx.followingServer = Werist.IP_WHOIS_SERVER[ctx.searchIpWhois.shift()];
            } else if (!ctx.searchIpWhois.length) {
              ctx.followingData.push(ctx.followingData);
              return _done();
            } else {
              ctx.followingServer = Werist.IP_WHOIS_SERVER[ctx.searchIpWhois.shift()];
            }
            if (!ctx.followingServer) {
              return _done();
            }
            _addWhoIsData(true);
            return this._lookup(ctx, callback);
          } else if (ctx.searchIpWhois) {
            ctx.searchIpWhois = undefined;
          }
        }
        _addWhoIsData(false);

        _done();
      });
    };

    if (ctx.options.proxy) {
      Socks.createConnection({proxy: ctx.options.proxy, target: connectOptions}, (err, socket) => {
        if (err) {
          return callback(err);
        }
        _lookup(socket);
        socket.resume();
      });
    } else {
      const socket = net.createConnection(connectOptions);
      return _lookup(socket);
    }

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
   * @param {Werist~lookupOptions} [opt_options]
   * @param {Werist~lookupCallback} callback
   * @return {Werist~lookupCallback}
   */
  lookup(address, opt_options, callback) {
    if (typeof opt_options === 'function') {
      callback = opt_options;
      opt_options = {};
    }
    let options = {proxy: null};
    options.server = opt_options.server || null;
    options.follow = opt_options.follow || 2;
    options.timeout = typeof opt_options.timeout === 'number' ? opt_options.timeout : 30;
    options.verbose = typeof opt_options.verbose === 'boolean' ? opt_options.verbose : false;
    options.bind = opt_options.bind || null;

    if (opt_options.proxy && typeof opt_options.proxy === 'object' && opt_options.proxy.ipaddress && opt_options.proxy.port) {
      if (!net.isIP(opt_options.proxy.ipaddress)) {
        return callback(new Error('invalid proxy ip address'));
      }
      options.proxy = {
        ipaddress: opt_options.proxy.ipaddress,
        port: parseInt(opt_options.proxy.port),
        type: opt_options.proxy.type || 5
      };
    }

    this._lookup({
      address: address,
      options: options,
      following: 0,
      followingData: []
    }, callback);
  }
}

module.exports = Werist;


Werist.QUERY_TYPE_DOMAIN = 'DOMAIN';
Werist.QUERY_TYPE_IP_ADDRESS = 'IP_ADDRESS';
Werist.IP_WHOIS_SERVER = {
  arin: 'whois.arin.net',
  ripe: 'whois.ripe.net',
  afriNic: 'whois.afrinic.net',
  apNic: 'whois.apnic.net',
  lacNic: 'whois.lacnic.net'
};
