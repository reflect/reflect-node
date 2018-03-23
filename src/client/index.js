const axios = require('axios');
const debug = require('debug')('reflect-node');
const Errors = require('../errors');
const Reporting = require('./reporting');

const DEFAULT_HOST = 'https://api.reflect.io';

const nodeVersion = process.version;
const pkgVersion = require('../../package.json').version;

const methods = {
  GET: 'get',
  PUT: 'put',
  POST: 'post',
};

const logDebug = (method, url, status, headers) => debug(
  'method=%s url=%s: status=%s reflect-request-identifier=%s',
  method,
  url,
  status,
  headers['reflect-request-identifier']
);

function Client(token) {
  this._token = token;
  this._host = DEFAULT_HOST;

  this.reporting = new Reporting(this);
}

Client.prototype.request = function request(method, path, opts = {}) {
  const url = `${this._host}/${path}`;
  const headers = {
    'User-Agent': `reflect-node v${pkgVersion} (node ${nodeVersion})`, // TODO: Add version
  };

  const config = Object.assign(opts, {
    url,
    method,
    headers,
    auth: { password: this._token },
  });

  return axios(config)
    .then((res) => {
      logDebug(
        method,
        url,
        res.status,
        res.headers
      );

      return res.data;
    })
    .catch((error) => {
      if (error.response) {
        logDebug(
          method,
          url,
          error.response.status,
          error.response.headers
        );
      }

      throw Errors.fromResponse(error);
    });
};

Client.prototype.get = function get(path, opts) {
  return this.request(methods.GET, path, opts);
};

exports.Client = Client;
