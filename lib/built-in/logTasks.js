
'use strict';

/*
 * module dependencies
 */

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

runtime.set('log', function logTasks(argv, args){

  var gulp = require('gulp');
  var ansiJS = require('ansi-highlight');

  var tasks = argv;
  var colorIs = util.type(args.color);

  tasks = tasks.filter(function(taskName){
    return gulp.tasks[taskName];
  });

  if(tasks.length !== 0){

    tasks.forEach(function(taskName){

      var task = gulp.tasks[taskName];
      var str = ('\ngulp.task(\'' + task.name + '\',' +
          JSON.stringify(task.dep) +', ' +
          (''+task.fn) + ');\n').replace(/\n/g, '\n  ');

      if( colorIs.true || colorIs.undefined ){
        console.log( ansiJS(str) );
      } else {
        console.log(str);
      }
    });

  } else {
    console.warn('No task with name `'+argv.slice(-1)[0]+'`');
  }

  runtime.prompt();
});
