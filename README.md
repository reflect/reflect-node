# reflect-node

This is a client for the [Reflect API](https://reflect.io/docs/).

## Installation

This package is indexed in npm.

```bash
$ npm install reflect-node
```

## Generating an Authentication Token

Here's an example of how you'd generate an encrypted authentication token.

```javascript
var reflect = require('reflect-node');

var accessKey = 'd232c1e5-6083-4aa7-9042-0547052cc5dd',
    secretKey = '74678a9b-685c-4c14-ac45-7312fe29de06';

var b = new reflect.ProjectTokenBuilder(accessKey)
  .setAttribute('user-id', 1234)
  .setAttribute('user-name', 'Billy Bob')
  .addParameter({
    'field': 'My Field',
    'op': '=',
    'value': 'My Value',
  });
b.build(secretKey, function(err, token) {
  console.log(token);
});
```
