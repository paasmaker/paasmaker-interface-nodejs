// Test for the node.js interface.

var assert = require('assert');
var paasmaker = require('./paasmaker-interface.js');

// First run - try to call load. It will fail because it's not running on
// Paasmaker and there are no files to load.
console.log("Testing no environment variables and no overrides.")

assert.throws(
	function() {
		new paasmaker();
	},
	/No config files were supplied/
);

// Try to load non-existent configuration files; should also throw errors.
console.log("Testing configuration file load errors.");

assert.throws(
	function() {
		new paasmaker([]);
	},
	/Empty array of config files/
);
assert.throws(
	function() {
		new paasmaker(['configs/noexist.json', 'configs/noexist2.json']);
	},
	/load any of the supplied config/
);

// Now try to load from a configuration file.
console.log("Testing loading from configuration file.");

var pm = new paasmaker(['configs/noexist.json', 'configs/test.json']);

assert.strictEqual(pm.port, 9000);
assert.ok(pm.metadata);
assert.equal(pm.metadata.application.name, "test");
assert.ok(pm.services.parameters);

// Now try loading from environment variables.
console.log("Testing loading from environment variables.");

process.env.PM_SERVICES = JSON.stringify({'variables': {'one': 'two'}});
process.env.PM_METADATA = JSON.stringify({
	'application': {
		'name': 'test',
		'version': 1,
		'workspace': 'Test',
		'workspace_stub': 'test'
	},
	'node': {'one': 'two'},
	'workspace': {'three': 'four'}
});
process.env.PM_PORT = "42600";

var pm = new paasmaker();

assert.ok(pm.metadata);
assert.ok(pm.services);
assert.ok(pm.services.variables);
assert.strictEqual(pm.port, 42600);

delete process.env['PM_SERVICES']
delete process.env['PM_METADATA']
delete process.env['PM_PORT']
