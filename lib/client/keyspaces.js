'use strict';

var Keyspace = function(client, attrs) {
  this.client = client;
  this._attrs = attrs;
};

Keyspace.prototype.replace = function(key, data, complete, failure) {
  this.client.post("/v1/keyspaces/"+this._attrs['name']+"/tablets/"+key, data, complete, failure);
};

Keyspace.prototype.append = function(key, data, complete, failure) {
  this.client.put("/v1/keyspaces/"+this._attrs['name']+"/tablets/"+key, data, complete, failure);
};

var Keyspaces = exports.Keyspaces = function(client) {
  this.client = client;
};

Keyspaces.prototype.find = function(name, complete, failure) {
  var self = this,
      wrapper = function(data) {
    var keyspace = new Keyspace(self.client, JSON.parse(data));
    complete(keyspace);
  };

  this.client.get('/v1/keyspaces/'+name, null, wrapper, failure);
};
