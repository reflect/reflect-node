const chai = require('chai');
const mockClient = require('./mockClient');

const Projects = require('../../src/client/projects');

describe('Projects', () => {
  beforeEach(mockClient.reset);

  describe('#list()', () => {
    it('should generate the request', () => {
      const manager = new Projects(mockClient);

      manager.list();

      chai.expect(mockClient.get.calledOnce).to.eql(true);
    });
  });

  describe('#get()', () => {
    it('should generate the request', () => {
      const manager = new Projects(mockClient);

      manager.get('myProjectSlug');

      const args = mockClient.get.args[0];
      chai.expect(mockClient.get.calledOnce).to.eql(true);
      chai.expect(args[0]).to.eql('v1/projects/myProjectSlug');
    });
  });

  describe('#create()', () => {
    it('should generate the request', () => {
      const manager = new Projects(mockClient);
      const project = {
        name: 'My project',
        slug: 'myProject',
      };

      manager.create(project);

      chai.expect(mockClient.post.calledOnce).to.eql(true);
    });
  });

  describe('#update()', () => {
    it('should generate the request', () => {
      const manager = new Projects(mockClient);

      manager.update('myProject', { name: 'Name 2' });

      const args = mockClient.put.args[0];
      chai.expect(mockClient.put.calledOnce).to.eql(true);
      chai.expect(args[0]).to.eql('v1/projects/myProject');
    });
  });

  describe('#destroy()', () => {
    it('should generate the request', () => {
      const manager = new Projects(mockClient);

      manager.destroy('myProject');

      chai.expect(mockClient.delete.calledOnce).to.eql(true);
    });
  });

  describe('#getStatements()', () => {
    it('should generate the request', () => {
      const manager = new Projects(mockClient);

      manager.getStatements('myProject');

      const args = mockClient.get.args[0];
      chai.expect(mockClient.get.calledOnce).to.eql(true);
      chai.expect(args[0]).to.eql('v1/projects/myProject/statements');
    });
  });

  describe('#associateConnection()', () => {
    it('should generate the request', () => {
      const manager = new Projects(mockClient);

      manager.associateConnection('myProject', 'myConnection');

      const args = mockClient.post.args[0];
      chai.expect(mockClient.post.calledOnce).to.eql(true);
      chai.expect(args[0]).to.eql('v1/projects/myProject/connections');
    });
  });

  describe('#getKeyPairs()', () => {
    it('should generate the request', () => {
      const manager = new Projects(mockClient);

      manager.getKeyPairs('myProject');

      const args = mockClient.get.args[0];
      chai.expect(mockClient.get.calledOnce).to.eql(true);
      chai.expect(args[0]).to.eql('v1/projects/myProject/key-pairs');
    });
  });
});
