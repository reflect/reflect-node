'use strict';

var crypto = require('crypto');

/**
 * Generates a signed authentication token to use when authenticating clients
 * against the API and enforcing certain parameters. The attrs that you supply
 * will be appended when generating the HMAC.
 *
 * Parameters should be an array of objects with one of the following schemas:
 *
 * {
 *   field: 'My Field',
 *   op: '=',
 *   value: 'Hello, World!'
 * }
 *
 * or
 *
 * {
 *   field: 'My Field',
 *   op: '=',
 *   any: ['First Choice', 'Second Choice']
 * }
 *
 * @param {string} secretKey the secret key for your key pair.
 * @param {Array} params an array of parameter objects.
 */
exports.generateToken = function(secretKey, params) {
  var strs = [],
      param;

  for (var i = 0, len = params.length; i < len; i++) {
    var val = '',
        vals = [];

    param = params[i];

    if (param.any) {
      vals = param.any.slice();
      vals.sort();
    } else {
      val = param.value;
    }

    strs.push(JSON.stringify([param.field, param.op, val, vals]));
  }

  strs.sort();

  var h = crypto.createHmac('sha256', secretKey).
    update("V2\n").
    update(strs.join("\n")).
    digest('base64');
  return '=2=' + h;
};
