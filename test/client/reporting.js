const chai = require('chai');
const mockClient = require('./mockClient');

const Reporting = require('../../src/client/reporting');

describe('Reporting', () => {
  beforeEach(mockClient.reset);

  describe('#report()', () => {
    it('should generate the request', () => {
      const rep = new Reporting(mockClient);
      const options = { test: true };

      rep.report('my-project', ['My dimension'], ['My metric'], options);

      const args = mockClient.get.args[0];

      chai.expect(args[0]).to.eql('v1/projects/my-project/report');
      chai.expect(args[1].params).to.eql({
        dimensions: '["My dimension"]',
        metrics: '["My metric"]',
        test: 'true',
      });
    });
  });
});
