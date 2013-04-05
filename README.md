# Paasmaker node.js interface

This is a helper library for node.js applications deployed with Paasmaker.

You can read more about the Paasmaker platform as a service at www.paasmaker.org.


### To install

Simply use npm:
```
$ npm install paasmaker
```

Source code for the library is on [BitBucket](https://bitbucket.org/paasmaker/paasmaker-interface-nodejs) and [GitHub](https://github.com/paasmaker/paasmaker-interface-nodejs).


### In your application

Require the library and then create a new instance:

```js
var paasmaker = require('paasmaker');

var pm = new paasmaker();
```

The new instance object has a few important properties, listed below.

#### port

The port number that your application should listen on. This is assigned to your app by Paasmaker's router so it doesn't conflict with other running apps.

#### services

This is a hash of connection information returned by Paasmaker service plugins (databases, caches, etc.).

For example, if you have the [mongoDB plugin](http://docs.paasmaker.org/plugin-service-managedmongodb.html) enabled, your services object might look like this:

```json
{
  "services": {
    "mongodb": {
      "hostname": "192.168.0.1",
      "port": 1234
    }
  }
}
```


### Local development with configuration files

For local development (not running on Paasmaker), you can provide an array of files to load to the ```paasmaker()``` constructor.

Alternatively, consider setting up a local instance of Paasmaker and using the development directory plugin.


### Example application

```
var http = require('http');
var paasmaker = require('paasmaker');

var pm = new paasmaker();

http.createServer(function (req, res) {
  res.end("Hello, world!", 'utf8');
}).listen(pm.port);
```


### Errors

Because error handling in Node is [complicated](http://snmaynard.com/2012/12/21/node-error-handling/), we've taken the simple way out of just throwing exceptions. In normal use, though, you can expect your application to only have two states: running (with the correct configuration set) and not running.


### License

This interface library is released under the [MIT License](http://opensource.org/licenses/MIT). Paasmaker itself is licensed under the [MPL v2](http://www.mozilla.org/MPL/2.0/).

