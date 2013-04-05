
var fs = require('fs');

// NOTE: We're using sync operators in this file for simplicity.

// Read environment variables.
function loadFromEnvironment() {
	exports.services = JSON.parse(process.env.PM_SERVICES);
	exports.metadata = JSON.parse(process.env.PM_METADATA);
	exports.metadata['port'] = parseInt(process.env.PM_PORT, 10);
}

function loadFromFiles(files) {
	if(files) {
		for(var i = 0; i < files.length; i++) {
			var filename = files[i];
			if(fs.existsSync(filename)) {
				var contents = fs.readFileSync(filename);
				var parsed = JSON.parse(contents);

				if(parsed.services && parsed.application) {
					exports.services = parsed.services;
					exports.metadata = parsed.application;

					if(parsed.port) {
						parsed.application['port'] = parsed.port;
					}

					// TODO: Validate.

					// Stop processing.
					return;
				}
			} else {
				throw new Error("Couldn't load config file: " + filename);
			}
		}

		throw new Error("Unable to find a configuration file to load.");
	} else {
		throw new Error("No files supplied, and not running on Paasmaker.");
	}
}

exports.load = function(files) {
	exports.services = {};
	exports.metadata = {};

	exports.isOnPaasmaker = !!process.env.PM_SERVICES && !!process.env.PM_METADATA;

	if(exports.isOnPaasmaker) {
		loadFromEnvironment();
	} else {
		loadFromFiles(files);
	}
}
