'use strict';

const Werist = require('./werist');
let _weristInstance = null;

module.exports.Werist = Werist;

/**
 * lookup domain or ip address
 *
 * @param {String} address  domain or ip address
 * @param {Object} [options]
 * @param {Werist~lookupCallback} callback
 */
module.exports.lookup = function(address, options, callback) {
  if (!_weristInstance) {
    _weristInstance = new Werist();
  }
  _weristInstance.lookup(address, options, callback);
};
