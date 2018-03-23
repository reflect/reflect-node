const axios = require('axios');
const Errors = require('../errors');
const Reporting = require('./reporting');

const API_ROOT = 'https://api.reflect.io';

const methods = {
  GET: 'get',
  PUT: 'put',
  POST: 'post',
};

function Client(token) {
  this._token = token;

  this.reporting = new Reporting(this);
}

Client.prototype.request = function request(method, url, opts) {
  const headers = {
    'User-Agent': 'reflect-node', // TODO: Add version
  };

  const config = Object.assign(opts, {
    url,
    method,
    headers,
    auth: { password: this._token },
  });

  return axios(config)
    .catch((error) => {
      throw Errors.fromResponse(error);
    });
};

Client.prototype.get = function get(path, opts) {
  const url = `${API_ROOT}/${path}`;

  return this.request(methods.GET, url, opts);
};

exports.Client = Client;
