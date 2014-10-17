'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

module.exports = taskStatus;

//
// ## function `taskStatus`
// mirror gulp's `logEvents` to gather information
//

function taskStatus(gulpInst){
  var statusMap = {
        'task_start' : 'start',
         'task_stop' : 'done',
         'task_err'  : 'error',
     'task_no_found' : 'notFound'
  };
  Object.keys(statusMap).forEach(function(eventName){
    gulpInst.on(eventName, function(taskEvent){
      runtime.emit('status', taskEvent);
    });
  });
}
