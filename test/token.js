const jose = require('node-jose');
const uuidv4 = require('uuid/v4');
const token = require('../src/token');
const utils = require('../src/utils');

const chai = require('chai');

describe('ProjectTokenBuilder', () => {
  const accessKey = uuidv4();
  const secretKey = uuidv4();
  const secretKeyBuffer = utils.secretKeyFromUUID(secretKey);

  it('generates', (done) => {
    const b = new token.ProjectTokenBuilder(accessKey);
    b.build(secretKey, (err, t) => {
      chai.expect(err).to.not.exist;

      jose.JWK.asKey({
        kty: 'oct',
        alg: 'A128GCM',
        k: secretKeyBuffer,
      }).then((key) => {
        jose.JWE.createDecrypt(key).decrypt(t).then((result) => {
          chai.expect(result.header.kid).to.equal(accessKey);

          done();
        });
      });
    });
  });

  it('expires at the right time', (done) => {
    const expiration = new Date();
    expiration.setUTCMinutes(expiration.getUTCMinutes() + 15);

    const b = new token.ProjectTokenBuilder(accessKey)
      .expiration(expiration);
    b.build(secretKey, (err, t) => {
      chai.expect(err).to.not.exist;

      jose.JWK.asKey({
        kty: 'oct',
        alg: 'A128GCM',
        k: secretKeyBuffer,
      }).then((key) => {
        jose.JWE.createDecrypt(key).decrypt(t).then((result) => {
          chai.expect(result.header.kid).to.equal(accessKey);

          const payload = JSON.parse(result.payload);

          const now = Math.floor(Date.now() / 1000);
          chai.expect(payload.iat).to.be.most(now);
          chai.expect(payload.nbf).to.be.most(now);
          chai.expect(payload.exp).to.be.above(now);

          done();
        });
      });
    });
  });

  it('handles all claims', (done) => {
    const parameter = { field: 'user-id', op: '==', value: '1234' };

    const b = new token.ProjectTokenBuilder(accessKey)
      .addViewIdentifier('SecUr3View1D')
      .setAttribute('user-id', 1234)
      .setAttribute('user-name', 'Billy Bob')
      .addParameter(parameter);
    b.build(secretKey, (err, t) => {
      chai.expect(err).to.not.exist;

      jose.JWK.asKey({
        kty: 'oct',
        alg: 'A128GCM',
        k: secretKeyBuffer,
      }).then((key) => {
        jose.JWE.createDecrypt(key).decrypt(t).then((result) => {
          chai.expect(result.header.kid).to.equal(accessKey);

          const payload = JSON.parse(result.payload);

          chai.expect(payload['http://reflect.io/s/v3/vid']).to.have.lengthOf(1);
          chai.expect(payload['http://reflect.io/s/v3/vid']).to.include('SecUr3View1D');

          chai.expect(payload['http://reflect.io/s/v3/p']).to.have.lengthOf(1);
          chai.expect(payload['http://reflect.io/s/v3/p']).to.deep.include(parameter);

          chai.expect(Object.getOwnPropertyNames(payload['http://reflect.io/s/v3/a'])).to.have.lengthOf(2);
          chai.expect(payload['http://reflect.io/s/v3/a']).to.own.include({ 'user-id': 1234 });
          chai.expect(payload['http://reflect.io/s/v3/a']).to.own.include({ 'user-name': 'Billy Bob' });

          done();
        });
      });
    });
  });
});
