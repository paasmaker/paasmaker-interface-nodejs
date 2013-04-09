/**
 * Paasmaker node.js application interface
 * MIT licensed (see LICENSE)
 *
 * This is a helper library for node.js applications deployed with Paasmaker.
 *
 * Notes:
 * - To run, require() this file and create a new instance. Your application
 *   will need to listen on this.getPort() to work.
 * - In development, provide an array of paths to the constructor and they'll
 *   be tried for config files. (Otherwise, this script reads the environment
 *   variables set by Paasmaker.)
 * - We're using sync operators here for simplicity (otherwise your entire
 *   app would have to wait for a callback).
 */

var fs = require('fs');

var Paasmaker = function(files) {
	if (this.isOnPaasmaker()) {
		this.services = JSON.parse(process.env.PM_SERVICES);
		this.metadata = JSON.parse(process.env.PM_METADATA);
		this.port = parseInt(process.env.PM_PORT, 10);

	} else {
		if (files && typeof files == 'object') {
			if (files.length) {
				var success = this.loadConfigurationFile(files);
				if (!success) {
					throw new Error("Couldn't load any of the supplied config files: " + files.join())
				}
			} else {
				throw new Error("Empty array of config files supplied; no configuration to use.");
			}
		} else {
			throw new Error("Application is not running on Paasmaker. No config files were supplied for development use.");
		}
	}

	return this;
}

//--------

Paasmaker.prototype.loadConfigurationFile = function(files) {
	for(var i = 0; i < files.length; i++) {
		var filename = files[i];
		if(fs.existsSync(filename)) {
			var contents = fs.readFileSync(filename);
			var parsed = JSON.parse(contents);

			if(parsed.services && parsed.application) {
				this.services = parsed.services;
				this.metadata = {};
				this.metadata.application = parsed.application;

				if(parsed.port) {
					this.port = parsed.port;
				}

				// TODO: Validate.

				// Stop processing.
				return true;
			}
		}
	}

	return false;
}

//--------

/*
Paasmaker.prototype.metadata = {};
Paasmaker.prototype.services = {};
Paasmaker.prototype.port = 0;
*/

Paasmaker.prototype.isOnPaasmaker = function () {
	return (
		typeof process.env == 'object'
		&& typeof process.env.PM_SERVICES == 'string'
		&& typeof process.env.PM_METADATA == 'string'
	)
}

Paasmaker.prototype.getService = function(name) {
	if (this.services[name]) {
		return this.services[name];
	} else {
		throw new Error("No such service " + name)
	}
}

Paasmaker.prototype.getAllServices = function() {
	return this.services;
}

Paasmaker.prototype.getApplicationName = function() {
	return this.metadata.application.name;
}

Paasmaker.prototype.getApplicationVersion = function() {
	return this.metadata.application.version;
}

Paasmaker.prototype.getWorkspaceName = function() {
	return this.metadata.application.workspace;
}

Paasmaker.prototype.getWorkspaceStub = function() {
	return this.metadata.application.workspace_stub;
}

Paasmaker.prototype.getNodeTags = function() {
	if (this.metadata.node) {
		return this.metadata.node;
	} else {
		return {};
	}
}

Paasmaker.prototype.getWorkspaceTags = function() {
	if (this.metadata.workspace) {
		return this.metadata.workspace;
	} else {
		return {};
	}
}

Paasmaker.prototype.getPort = function() {
	return this.port;
}

//--------

module.exports = Paasmaker;
