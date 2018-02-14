var jose = require('node-jose');
var uuidv4 = require('uuid/v4');
var token = require('../src/token');
var utils = require('../src/utils');

var chai = require('chai');

describe('ProjectTokenBuilder', function() {
  var accessKey = uuidv4();
  var secretKey = uuidv4();
  var secretKeyBuffer = utils.secretKeyFromUUID(secretKey);

  it('generates', function(done) {
    var b = new token.ProjectTokenBuilder(accessKey);
    b.build(secretKey, function(err, t) {
      chai.expect(err).to.not.exist;

      jose.JWK.asKey({
        kty: 'oct',
        alg: 'A128GCM',
        k: secretKeyBuffer,
      }).then(function(key) {
        jose.JWE.createDecrypt(key).decrypt(t).then(function(result) {
          chai.expect(result.header.kid).to.equal(accessKey);

          done();
        });
      });
    });
  });

  it('expires at the right time', function(done) {
    var expiration = new Date();
    expiration.setUTCMinutes(expiration.getUTCMinutes() + 15);

    var b = new token.ProjectTokenBuilder(accessKey)
      .expiration(expiration);
    b.build(secretKey, function(err, t) {
      chai.expect(err).to.not.exist;

      jose.JWK.asKey({
        kty: 'oct',
        alg: 'A128GCM',
        k: secretKeyBuffer,
      }).then(function(key) {
        jose.JWE.createDecrypt(key).decrypt(t).then(function(result) {
          chai.expect(result.header.kid).to.equal(accessKey);

          var payload = JSON.parse(result.payload);

          var now = Math.floor(Date.now() / 1000);
          chai.expect(payload.iat).to.be.most(now);
          chai.expect(payload.nbf).to.be.most(now);
          chai.expect(payload.exp).to.be.above(now);

          done();
        });
      });
    });
  });

  it('handles all claims', function(done) {
    var parameter = {field: 'user-id', op: '==', value: '1234'};

    var b = new token.ProjectTokenBuilder(accessKey)
      .addViewIdentifier('SecUr3View1D')
      .setAttribute('user-id', 1234)
      .setAttribute('user-name', 'Billy Bob')
      .addParameter(parameter);
    b.build(secretKey, function(err, t) {
      chai.expect(err).to.not.exist;

      jose.JWK.asKey({
        kty: 'oct',
        alg: 'A128GCM',
        k: secretKeyBuffer,
      }).then(function(key) {
        jose.JWE.createDecrypt(key).decrypt(t).then(function(result) {
          chai.expect(result.header.kid).to.equal(accessKey);

          var payload = JSON.parse(result.payload);

          chai.expect(payload['http://reflect.io/s/v3/vid']).to.have.lengthOf(1);
          chai.expect(payload['http://reflect.io/s/v3/vid']).to.include('SecUr3View1D');

          chai.expect(payload['http://reflect.io/s/v3/p']).to.have.lengthOf(1);
          chai.expect(payload['http://reflect.io/s/v3/p']).to.deep.include(parameter);

          chai.expect(Object.getOwnPropertyNames(payload['http://reflect.io/s/v3/a'])).to.have.lengthOf(2);
          chai.expect(payload['http://reflect.io/s/v3/a']).to.own.include({'user-id': 1234});
          chai.expect(payload['http://reflect.io/s/v3/a']).to.own.include({'user-name': 'Billy Bob'});

          done();
        });
      });
    });
  });
});
