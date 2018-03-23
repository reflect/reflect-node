const chai = require('chai');
const nock = require('nock');

const { Client } = require('../../src/client');

describe('Client', () => {
  before(() => {
    nock.disableNetConnect();
  });

  beforeEach(() => {
    nock.cleanAll();
  });

  describe('init', () => {
    it('should initialize client with token', () => {
      const client = new Client('my-token');

      chai.expect(client._token).to.eql('my-token');
    });
  });

  describe('#request', () => {
    it('should make the correct request', (done) => {
      nock('https://api.reflect.io')
        .get('/v1/projects/my-project/report')
        .query({ test: true })
        .reply(200, { myResponse: true });

      const client = new Client('my-token');

      client.request('get', 'v1/projects/my-project/report', {
        params: { test: true },
      })
        .then((res) => {
          chai.expect(res.myResponse).to.eql(true);

          done();
        })
        .catch(() => chai.fail());
    });

    it('should properly handle errors', (done) => {
      const error = {
        code: 406,
        message: 'Could not process',
        messages: ['Message 1'],
      };

      nock('https://api.reflect.io')
        .get('/v1/projects/my-project/report')
        .reply(406, { error });

      const client = new Client('my-token');

      client.request('get', 'v1/projects/my-project/report')
        .then(() => chai.fail())
        .catch((e) => {
          chai.expect(e.code).to.eql(406);
          chai.expect(e.toString()).to.eql('Error: Could not process');
          chai.expect(e.messages).to.eql(['Message 1']);

          done();
        });
    });
  });
});
