'use strict';

/**
 * A single keyspace.
 *
 * @class
 */
var Keyspace = function(client, attrs) {
  this.client = client;
  this._attrs = attrs;
};

/**
 * Replace all the data backing a key with the supplied data.
 *
 * @param {string} key the key to replace data for.
 * @param {Object|array} data JSON-serializable data to send to the server.
 * @param {function} complete a callback to call when the call is completed.
 * @param {function} failure a callback to call if call fails.
 */
Keyspace.prototype.replace = function(key, data, complete, failure) {
  this.client.post("/v1/keyspaces/"+this._attrs['name']+"/tablets/"+key, data, complete, failure);
};

/**
 * Append records to the tablet backing a key.
 *
 * @param {string} key the key to append records to.
 * @param {Object|array} data JSON-serializable data to send to the server.
 * @param {function} complete a callback to call when the call is completed.
 * @param {function} failure a callback to call if the call fails.
 */
Keyspace.prototype.append = function(key, data, complete, failure) {
  this.client.put("/v1/keyspaces/"+this._attrs['name']+"/tablets/"+key, data, complete, failure);
};

/**
 * All keyspace related services.
 *
 * @class
 */
var Keyspaces = exports.Keyspaces = function(client) {
  this.client = client;
};

/**
 * Find a single keyspace by slug.
 *
 * @param {string} name The slug of the keyspace to searh for.
 * @param {function} complete A callback to call when the call is completed.
 * @param {function} failure a callback to call when the call has failed.
 */
Keyspaces.prototype.find = function(name, complete, failure) {
  var self = this,
      wrapper = function(data) {
    var keyspace = new Keyspace(self.client, JSON.parse(data));
    complete(keyspace);
  };

  this.client.get('/v1/keyspaces/'+name, null, wrapper, failure);
};
