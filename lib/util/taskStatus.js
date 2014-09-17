'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

module.exports = taskStatus;

//
// ## function `taskStatus`
// mirror gulp's `logEvents` to gather information
//

function taskStatus(gulpInst){

  var status = { };
  var statusMap = {
        'task_start' : 'started',
         'task_stop' : 'finished',
         'task_err'  : 'errored',
     'task_no_found' : 'notFound'
  };

  Object.keys(statusMap).forEach(function(eventName){

    var statusName = statusMap[eventName];

    var onError = eventName.match(/err/);
    var onStop = eventName.match(/stop|err/);
    var onNotFound = eventName.match(/not_found/);

    gulpInst.on(eventName, function(taskEvent){

      var e = taskEvent;
      e[statusName] = e.task;

      if( gulpInst.tasks[e.task].dep[0] ){
        e.dep = gulpInst.tasks[e.task].dep;
      }

      if( onStop || onError || onNotFound ){
        e.time = util.prettyTime(e.hrDuration);
      }

      if( onError ){
        e.message = util.formatError(e);
      }

      status[e.task] = e;

      runtime.config('status', status);
      runtime.emit('status', status);
    });
  });
}
