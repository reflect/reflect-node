const sinon = require('sinon');

const spies = ['get', 'post', 'put', 'delete'];

const mockClient = spies.reduce((client, method) => {
  client[method] = sinon.spy();

  return client;
}, {});

mockClient.reset = () => spies.forEach((spy) => {
  mockClient[spy].resetHistory();
});

module.exports = mockClient;
