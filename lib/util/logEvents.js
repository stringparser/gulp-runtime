'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

exports = module.exports = logEvents;

// wire up logging events
function logEvents(gulpInst){

  var chalk = util.colors;
  // total hack due to poor error management in orchestrator
  gulpInst.on('err', function () {
    runtime.config({ failed : true });
    runtime.emit('status', { error : true, unhandled : true });
  });

  gulpInst.on('task_start', function (e) {
    // TODO: batch these
    // so when 5 tasks start at once it only logs one time with all 5
    var batched = '\'' + e.task + '\'';
    util.batchThese('start', batched, function(batch){
      util.log('Starting', util.quotify(batch.join(', ')),'...');
      runtime.emit('status', e);
    });
  });

  gulpInst.on('task_stop', function (e) {

    var time = util.prettyTime(e.hrDuration);
    var batched = '\''+e.task +'\' after '+chalk.magenta(time);
    util.batchThese('stop', batched, function(batch){
      util.log('Finished', util.quotify(batch.join(', ')) );
      runtime.emit('status', e);
    });
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
    runtime.emit('status', e);
  });

  gulpInst.on('task_not_found', function (err) {
    util.log(
      chalk.red('Task \'' + err.task + '\' is not in your gulpfile')
    );
    util.log('Please check the documentation for proper gulpfile formatting');
    runtime.emit('status', err);
    process.exit(1);
  });
}
