# reflect-node

This is a client for the [Reflect API](https://reflect.io/docs/reference/rest-api).

This library includes support for [generating authentication tokens](#Generating-an-Authentication-Token)
as well as [using the Reflect REST API](#API-methods).

## Installation

Install reflect-node through npm:

```bash
$ npm install reflect-node
```

## API methods

This functionality is currently under development. You can expect to see
expanded support for our various endpoints down the road.

### Getting started

After [Installation](#Installation), require `reflect-node` from your
application:

```javascript
const Reflect = require('reflect-node');
```

For the next step you'll need a Reflect API token. You can find yours by logging
into https://app.reflect.io then navigating to the Tokens section of the Account
page.

```javascript
const client = new Reflect.Client('my-api-token');
```

Once you've created a `Client` instance, you're ready to make authenticated
requests to the Reflect API using `reflect-node`.

The documentation below assumes you've completed these two steps, and have an
instance of `Client` stored in a `client` variable.

#### Resources

`reflect-node` is broken up into various resources with methods for manipulating
them. The various resources and their methods are documented below.

##### Reporting

Our reporting APIs are allow you to query the connections you've previously
configured in Reflect.

We currently only support the `report()` method. This method accepts four
arguments:

Name | Type | Description
-----|------|--------------
`connectionSlug` | string | The connection slug you wish to query
`dimensions` | array | An array of dimension names you wish to query
`metrics` | array | An array of metric names to query
`options` | object | Options to query with

Note that it is required to specify either `dimensions` or `metrics`.

This method returns a promise.

Example:

```javascript
client.reporting.report('my-connection', ['Dimension 1'], ['Metric 1'])
  .then((data) => {
    console.log('data');
  })
```

### Debugging

To debug `reflect-node`, start your Node environment with the following
environment variable set `DEBUG=reflect-node`.

## Generating an Authentication Token

Here's an example of how you'd generate an encrypted authentication token.

```javascript
var reflect = require('reflect-node');

var accessKey = 'd232c1e5-6083-4aa7-9042-0547052cc5dd';
var secretKey = '74678a9b-685c-4c14-ac45-7312fe29de06';

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
