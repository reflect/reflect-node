'use strict';

var querystring = require('querystring'),
    request = require('request');

// These are all the files we want to include.
var files = [
  'Keyspaces'
];

var getUrl = function(host, path) {
  var sep = '';

  if(path[0] !== "/") {
    sep = "/";
  }

  return host + sep + path;
};

var Client = function(token, host) {
  this.host = host || "https://api.reflect.io";
  this.token = token;
};

Client.prototype.request = function(verb, path, data, complete, failure) {
  var shouldWrite;

  if(data && data !== "") {
    shouldWrite = true
  }

  var options = {
    url: getUrl(this.host, path),
    method: verb,
    auth: {
      username: '',
      password: this.token
    }
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

Client.prototype.get = function(path, data, complete, failure) {
  if(data) {
    path = path+'?'+querystring.stringify(data)
  }

  this.request('GET', path, null, complete, failure);
};

Client.prototype.post = function(path, data, complete, failure) {
  this.request('POST', path, data, complete, failure);
};

Client.prototype.put = function(path, data, complete, failure) {
  this.request('PUT', path, data, complete, failure);
}

Client.prototype.delete = function(path, data, complete, failure) {
  this.request('DELETE', path, data, complete, failure);
}

exports.createClient = function(token, host) {
  var client = new Client(token, host);

  files.forEach(function(f) {
    var exp = require('./client/'+f.toLowerCase());
    client[f.toLowerCase()] = new exp[f](client);
  });

  return client;
};
