'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');
var debug = require('debug')('gulp:events');

module.exports = logEvents;

function logEvents(gulpInst){

  var chalk = util.colors;
  // total hack due to poor error management in orchestrator
  gulpInst.on('err', function () {
    runtime.config({ failed : true });
  });

  gulpInst.on('task_start', function (e) {
    // TODO: batch these
    // so when 5 tasks start at once it only logs one time with all 5
    util.log('Starting', '\'' + chalk.cyan(e.task) + '\'...');

    var status = { };
    status[e.task] = e;
    status[e.task].status = 'start';
    runtime.config({ status : status });
    debug('status', status);
  });

  gulpInst.on('task_stop', function (e) {
    var time = util.prettyTime(e.hrDuration);
    util.log(
      'Finished', '\'' + chalk.cyan(e.task) + '\'',
      'after', chalk.magenta(time)
    );

    var status = { };
    status[e.task] = e;
    status[e.task].status = 'end';
    runtime.config({ status : status });
    debug('status', status);
  });

  gulpInst.on('task_err', function (e) {
    var msg = util.formatError(e);
    var time = util.prettyTime(e.hrDuration);
    util.log(
      '\'' + chalk.cyan(e.task) + '\'',
      chalk.red('errored after'),
      chalk.magenta(time)
    );
    util.log(msg);

    var status = { };
    status[e.task] = e;
    status[e.task].status = 'error';
    runtime.config({ status : status });
    debug('status', status);
  });

  gulpInst.on('task_not_found', function (err) {
    util.log(
      chalk.red('Task \'' + err.task + '\' is not in your gulpfile')
    );
    util.log('Please check the documentation for proper gulpfile formatting');

    var status = { };
    status[err.task] = err;
    status[err.task].status = 'notFound';
    runtime.config({ status : status });
    debug('status', status);
    process.exit(1);
  });
}
