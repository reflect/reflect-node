const chai = require('chai');

const { Client } = require('../../src/client');

describe('Client', () => {
  describe('initializing client', () => {
    it('should initialize client with token', () => {
      const client = new Client('my-token');

      chai.expect(client._token).to.eql('my-token');
    });
  });
});
