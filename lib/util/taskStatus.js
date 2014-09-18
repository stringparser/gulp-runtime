'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

module.exports = taskStatus;

//
// ## function `taskStatus`
// mirror gulp's `logEvents` to gather information
//

function taskStatus(gulpInst){

  var status = { task : { }, done : false, current : { } };
  var statusMap = {
        'task_start' : 'start',
         'task_stop' : 'done',
         'task_err'  : 'error',
     'task_no_found' : 'notFound'
  };

  Object.keys(statusMap).forEach(function(eventName){

    var statusName = statusMap[eventName];

    var onStart = eventName.match(/start/);
    var onError = eventName.match(/err/);
    var onStop = eventName.match(/stop|err/);
    var onNotFound = eventName.match(/not_found/);

    gulpInst.on(eventName, function(taskEvent){

      var e = taskEvent;
      e[statusName] = true;

      e.dep = gulpInst.tasks[e.task].dep;

      if( onStop || onError || onNotFound ){

        delete e.start;
        e.time = util.prettyTime(e.hrDuration);

        status.done = true;
        if( e.dep[0] ){

          var done = status.done;
          var task = status.task;
          e.dep.forEach(function(dep){
            status.done = done && task[dep].done;
          });
          status.done = done;
        } else {
          delete e.dep;
        }
      }

      if( onError ){
        e.message = util.formatError(e);
      }

      if( onStart ){
        status.done = false;
      }

      status.task[e.task] = e;
      status.current = e;
      var copy = util.merge({ }, status);
      runtime.emit('status', copy);
    });
  });
}
