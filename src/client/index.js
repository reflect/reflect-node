const axios = require('axios');
const debug = require('debug')('reflect-node');
const Errors = require('../errors');

const Reporting = require('./reporting');
const Projects = require('./projects');

const DEFAULT_HOST = 'https://api.reflect.io';

const nodeVersion = process.version;
const pkgVersion = require('../../package.json').version;

const methods = {
  GET: 'get',
  PUT: 'put',
  POST: 'post',
  DELETE: 'delete',
};

const logDebug = (method, url, status, headers) => debug(
  'method=%s url=%s: status=%s reflect-request-identifier=%s',
  method,
  url,
  status,
  headers['reflect-request-identifier']
);

/**
 * Client provides a simple interface for using the Reflect API from Node.
 *
 * Provides a way to authenticate, make requests, and robustly handle errors.
 *
 * @constructor
 * @param {string} token The API token to authenticate with. You can find this at https://app.reflect.io.
 *                       Can be either read-only or read-write, depending on the usage.
 * @param {string} [host=https://api.reflect.io] Host to use when querying
 */
function Client(token, host) {
  this._token = token;
  this._host = host || DEFAULT_HOST;

  this.reporting = new Reporting(this);
  this.projects = new Projects(this);
}

/**
 * Given a method, path, and some options, makes a request to the Reflect API using the configured
 * host.
 *
 * @param {string} method The HTTP method to use
 * @param {string} path The path to query
 * @param {Object} [opts={}] Options
 * @param {Object} opts.params Params to send in the request
 * @return {Promise} Promise that represents the HTTP request
 */
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

/**
 * Makes a GET request to the Reflect API.
 *
 * @param  {string} path The path to query
 * @param {Object} opts Options to make the request with
 * @return {Promise} Promise that represents the HTTP request
 */
Client.prototype.get = function get(path, opts) {
  return this.request(methods.GET, path, opts);
};

/**
 * Makes a POST request to the Reflect API.
 *
 * @param  {string} path The path to query
 * @param {Object} opts Options to make the request with
 * @return {Promise} Promise that represents the HTTP request
 */
Client.prototype.post = function post(path, opts) {
  return this.request(methods.POST, path, opts);
};

/**
 * Makes a PUT request to the Reflect API.
 *
 * @param  {string} path The path to query
 * @param {Object} opts Options to make the request with
 * @return {Promise} Promise that represents the HTTP request
 */
Client.prototype.put = function put(path, opts) {
  return this.request(methods.PUT, path, opts);
};

/**
 * Makes a DELETE request to the Reflect API.
 *
 * @param  {string} path The path to query
 * @param {Object} opts Options to make the request with
 * @return {Promise} Promise that represents the HTTP request
 */
Client.prototype.delete = function (path, opts) { // eslint-ignore-line func-names
  return this.request(methods.DELETE, path, opts);
};

exports.Client = Client;
