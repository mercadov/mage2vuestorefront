const { fork } = require('child_process');
var CronJob = require('cron').CronJob;

var exec = require('child_process').exec;

const execPromise = function(cmd) {
    return new Promise(function(resolve, reject) {
        exec(cmd, function(err, stdout) {
            if (err) {
            	console.error(err);
            	return reject(err)
            };
            console.log(stdout);
            resolve(stdout);
        });
    });
}

var commands = [
	"node --harmony cli.js categories --partitions=1 --removeNonExistient=true",
	"node --harmony cli.js productcategories --partitions=1",
	"node --harmony cli.js attributes --partitions=1 --removeNonExistient=true",
	"node --harmony cli.js taxrule --partitions=1 --removeNonExistient=true",
	"node --harmony cli.js products --partitions=1 --removeNonExistient=true"
];

new CronJob('30 * * * * *', function() {
	commands.reduce(function(p, cmd) {
	    return p.then(function(results) {
	    	console.log('Processing', cmd);
	        return execPromise(cmd).then(function(stdout) {
	            results.push(stdout);
	            return results;
	        });
	    });
	}, Promise.resolve([])).then(function(results) {
	    console.log('Magento sync complete.');
	}, function(err) {
	    console.error('Magento sync errored. Checkout error logs.');
	});
}, null, true, 'America/Los_Angeles');