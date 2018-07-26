const { fork } = require('child_process');
var CronJob = require('cron').CronJob;

new CronJob('30 * * * * *', function() {
	const forked = fork('cli.js', ['productsdelta', '--partitions=1']);

	forked.on('message', (msg) => {
	  console.log('Job: ', msg);
	});
}, null, true, 'America/Los_Angeles');