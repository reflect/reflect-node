'use strict';

var querystring = require('querystring'),
    request = require('request'),
    crypto = require('crypto');

// Files to require when the client is instantiated.
var files = [];

var getUrl = function(host, path) {
  var sep = '';

  if(path[0] !== "/") {
    sep = "/";
  }

  return host + sep + path;
};

var getAuthentication = function(tokens) {
  if (Array.isArray(tokens)) {
    return {
      username: tokens[0],
      password: tokens[1]
    };
  }

  return {
    username: '',
    password: tokens
  };
}

/**
 * @private
 */
var Client = function(tokens, host) {
  this.host = host || "https://api.reflect.io";
  this.tokens = tokens;
};

/**
 * @private
 */
Client.prototype.request = function(verb, path, data, complete, failure) {
  var shouldWrite;

  if(data && data !== "") {
    shouldWrite = true
  }

  var options = {
    url: getUrl(this.host, path),
    method: verb,
    auth: getAuthentication(this.tokens)
  };

  if(shouldWrite) {
    options.json = true;
    options.body = data;
    options.headers = {
      'Content-Type': 'application/json'
    };
  }

  request(options, function(e, r, body) {
    // If there is an error, let's pass that out.
    if(e) {
      failure && failure({}, e);
    }

    if(r.statusCode >= 200 && r.statusCode < 300) {
      complete && complete(body);
    } else {
      failure && failure(body);
    }
  });
};

/**
 * @private
 */
Client.prototype.get = function(path, data, complete, failure) {
  if(data) {
    path = path+'?'+querystring.stringify(data)
  }

  this.request('GET', path, null, complete, failure);
};

/**
 * @private
 */
Client.prototype.post = function(path, data, complete, failure) {
  this.request('POST', path, data, complete, failure);
};

/**
 * @private
 */
Client.prototype.put = function(path, data, complete, failure) {
  this.request('PUT', path, data, complete, failure);
}

/**
 * @private
 */
Client.prototype.delete = function(path, data, complete, failure) {
  this.request('DELETE', path, data, complete, failure);
}

/**
 * Create an instance of the Reflect client. The client exposes the following services.
 *
 * * Authentication token creation.
 *
 * @param {string} token the API token to use when making requests.
 */
exports.createClient = function(tokens, host) {
  var client = new Client(tokens, host);

  files.forEach(function(f) {
    var exp = require('./client/'+f.toLowerCase());
    client[f.toLowerCase()] = new exp[f](client);
  });

  return client;
};

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
