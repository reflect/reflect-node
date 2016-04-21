# reflect-node

This is a client for the [Reflect API](https://reflect.io/docs/). Currently,
it's pre-alpha--only a very few set of API endpoints are supported, namely
around uploading data.

## Installation

This package is indexed in npm.

```bash
$ npm install reflect-node
```

## Generating a Signed Authentication Token

Here's an example of how you'd generate a signed authentication token. Signed
authentication tokens are base64-encoded HMACs that are signed using your
project key pair's secret key.

```javascript
var reflect = require('reflect-node'),
    params;

params = [
  {
    "field": "My Field",
    "op": "=",
    "value": "My Value"
  }
];

token = reflect.generateToken('<your secret key>', params);
console.log(token);
```
