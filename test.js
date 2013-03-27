// Test for the interface.

var assert = require('assert');
var pminterface = require('./paasmaker-interface.js');

console.log("Testing no environment variables and no overrides.")

// First run - try to call load. It will fail because it's not running on
// Paasmaker and there are no files to load.
assert.throws(
	function() {
		pminterface.load();
	},
	Error,
	/No files/
);

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

pminterface = require('./paasmaker-interface.js');

pminterface.load();

assert.ok(pminterface.metadata);
assert.ok(pminterface.services);
assert.ok(pminterface.services.variables);
assert.strictEqual(pminterface.metadata.port, 42600);

delete process.env['PM_SERVICES']
delete process.env['PM_METADATA']
delete process.env['PM_PORT']

// Now try to load from a configuration file.
console.log("Testing loading from configuration file.");

pminterface = require('./paasmaker-interface.js');

pminterface.load(['configs/noexist.json', 'configs/test.json']);

assert.strictEqual(pminterface.metadata.port, 9000);
assert.ok(pminterface.metadata);
assert.equal(pminterface.metadata.name, "test");
assert.ok(pminterface.services.parameters);