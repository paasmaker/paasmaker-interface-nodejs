# Paasmaker node.js interface

This is a helper library for node.js applications deployed with Paasmaker.

You can read more about the Paasmaker platform as a service at www.paasmaker.org.


## To install

Simply use npm:
```
$ npm install paasmaker
```

Source code for the library is on [BitBucket](https://bitbucket.org/paasmaker/paasmaker-interface-nodejs) and [GitHub](https://github.com/paasmaker/paasmaker-interface-nodejs).


## In your application

Require the library and then create an instance:

```js
var paasmaker = require('paasmaker');

var pm = new paasmaker();
```

The new instance has a few important methods and properties, listed below.

### isOnPaasmaker()

Returns true if the application has been started by Paasmaker, i.e. configuration details are in the [environment variables](http://docs.paasmaker.org/user-howto-generic.html).

### getPort()

The port number that your application should listen on. This is assigned to your app by Paasmaker's router so it doesn't conflict with other running apps.

(As well as this getter function, the property ```port``` can also be used.)

### getAllServices()

Returns a hash of connection information returned by Paasmaker service plugins (databases, caches, etc.). You can also use the method ```getService(name)``` to return data on one particular service.

For example, if you have the [mongoDB plugin](http://docs.paasmaker.org/plugin-service-managedmongodb.html) enabled, the returned object might look like this:

```json
{
	"mongodb": {
		"hostname": "192.168.0.1",
		"port": 1234
	}
}
```

### Application metadata

There are several getter functions for generic metadata about Paasmaker's record of your application. For example, if your code is deployed as version 7 of an application called TestApp in a workspace called Test Workspace:

```js
pm.getApplicationName();	// returns "TestApp"
pm.getApplicationVersion();	// returns 7
pm.getWorkspaceName();		// returns "Test Workspace"
pm.getWorkspaceStub();		// returns "testworkspace"
```


## Local development with configuration files

For local development (not running on Paasmaker), you can provide an array of file paths to the ```paasmaker()``` constructor. Each path will be tried, and the first file that exists will be loaded.

Config files should be in JSON format with properties for port, service details, and application metadata:
```json
{
	"services": {
		"foobar": {
			"foo": "bar"
		}
	},
	"application": {
		"name": "test",
		"version": 1,
		"workspace": "Test",
		"workspace_stub": "test"
	},
	"port": 12345
}
```


Alternatively, consider setting up a local instance of Paasmaker and using the development directory plugin.


## Example application

```
var http = require('http');
var paasmaker = require('paasmaker');

var pm = new paasmaker();

if (!pm.isOnPaasmaker()) {
	throw new Error("Can't run, we're not deployed on Paasmaker!")
}

http.createServer(function (req, res) {
  res.end("Hello world! From " + pm.getApplicationName(), 'utf8');
}).listen(pm.port);
```


## Errors

Because error handling in Node is [complicated](http://snmaynard.com/2012/12/21/node-error-handling/), we've taken the simple way out of just throwing exceptions. Since the environment variables with configuration details are always set by Paasmaker, you're most likely to see exceptions in outside development where you've forgotten to set config files.


## License

This interface library is released under the [MIT License](http://opensource.org/licenses/MIT). Paasmaker itself is licensed under the [MPL v2](http://www.mozilla.org/MPL/2.0/).
