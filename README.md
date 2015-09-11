# reflect-node

This is a client for the [Reflect API](https://reflect.io/docs/). Currently,
it's pre-alpha--only a very few set of API endpoints are supported, namely
around uploading data.

## Installation

This package is indexed in npm.

```bash
$ npm install reflect-node
```

## Example

Here's an example of how to upload data to one of your keyspaces.

```javascript
var reflect = require('reflect-node');

var data = [
    {
      "customer_id": "customer1",
      "widget_id": "widget1",
      "manufactured": "Ohio",
      "temperature": 150
    },
    {
      "customer_id": "customer1",
      "widget_id": "widget2",
      "manufactured": "Ohio",
      "temperature": 50
    }
  ],
  client = reflect.createClient('<your API token>');

// First lookup the keyspace that we want to append data to.
client.keyspaces.find('{{slug}}', function(keyspace) {
  // Now we can actually send the data to the API.
  keyspace.replace('my-tablet', data);
});
```
