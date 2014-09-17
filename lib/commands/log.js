
'use strict';

/*
 * module dependencies
 */

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

runtime.set(['-l','--log'], function logTasks(argv, args){

  var gulp = require('gulp');

  var tasks = argv;
  var colorIs = util.type(args.color);

  tasks.forEach(function(name){
    if( !gulp.tasks[name] ){

      var task = gulp.tasks[name];
      var str = ('\ngulp.task(\'' + task.name + '\',' +
          JSON.stringify(task.dep) +', ' +
          (''+task.fn) + ');\n').replace(/\n/g, '\n  ');

      if( colorIs.true || colorIs.undefined ){
        str = util.ansiJS(str);
      }

      console.log(str);

    } else {

      util.batchThese('logTasks', name, function(batch){

        console.warn(
          util.quotify(
            'No task' + (batch[1] ? 's' : '') +
            ' with name `'+batch.join('`, `')+'`'
          )
        );
      });
    }
  });

  runtime.prompt();
});
