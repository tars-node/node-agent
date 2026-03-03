'use strict';

var assert = require('assert');
var fs = require('fs');
var os = require('os');
var path = require('path');
var childProcess = require('child_process');

var processContainer = path.resolve(__dirname, '../lib/ProcessContainer.js');
var pidFile = path.join(os.tmpdir(), 'node-agent-shell-child-' + process.pid + '-' + Date.now() + '.pid');
var shellCmd = 'node -e "require(\'fs\').writeFileSync(process.env.CHILD_PID_FILE, String(process.pid));setInterval(function(){}, 1000);"';

var timer = setTimeout(function() {
	cleanup();
	console.error('timeout: ProcessContainer did not exit in time');
	process.exit(1);
}, 15000);

function readPidWithRetry(retries, done) {
	fs.readFile(pidFile, 'utf8', function(err, content) {
		if (!err) {
			return done(null, parseInt(String(content).trim(), 10));
		}
		if (retries <= 0) {
			return done(err);
		}
		setTimeout(function() {
			readPidWithRetry(retries - 1, done);
		}, 100);
	});
}

function waitPidGone(pid, retries, done) {
	try {
		process.kill(pid, 0);
		if (retries <= 0) {
			return done(new Error('child pid still alive: ' + pid));
		}
		return setTimeout(function() {
			waitPidGone(pid, retries - 1, done);
		}, 100);
	} catch (err) {
		if (err && err.code === 'ESRCH') {
			return done();
		}
		return done(err);
	}
}

function cleanup() {
	clearTimeout(timer);
	try {
		fs.unlinkSync(pidFile);
	} catch (e) {}
}

var worker = childProcess.fork(processContainer, {
	silent: true,
	env: Object.assign({}, process.env, {
		CHILD_PID_FILE: pidFile,
		agent_args: JSON.stringify({
			exec_script: shellCmd,
			execution_mode: 'shell',
			project_root: process.cwd()
		})
	})
});

worker.on('error', function(err) {
	cleanup();
	throw err;
});

readPidWithRetry(50, function(err, childPid) {
	assert.ifError(err);
	assert.ok(!isNaN(childPid), 'child pid should be numeric');

	worker.once('exit', function(code) {
		assert.strictEqual(code, 0);
		waitPidGone(childPid, 50, function(waitErr) {
			cleanup();
			assert.ifError(waitErr);
		});
	});

	worker.send({
		cmd: 'agent.shutdown'
	});
});
