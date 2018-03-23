const chai = require('chai');
const sinon = require('sinon');

const Reporting = require('../../src/client/reporting');

describe('Reporting', () => {
  before(() => {
    this.mockClient = { get: sinon.spy() };
  });

  afterEach(() => {
    this.mockClient.get.resetHistory();
  });

  describe('report()', () => {
    it('should generate the request', () => {
      const rep = new Reporting(this.mockClient);
      const options = { test: true };

      rep.report('my-connection', ['My dimension'], ['My metric'], options);

      const args = this.mockClient.get.args[0];

      chai.expect(args[0]).to.eql('v1/projects/my-connection/report');
      chai.expect(args[1].params).to.eql({
        dimensions: '["My dimension"]',
        metrics: '["My metric"]',
        test: 'true',
      });
    });
  });
});
