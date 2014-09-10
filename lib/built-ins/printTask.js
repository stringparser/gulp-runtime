
/*
 * module dependencies
 */
var is = require('utils-type');
var gulp = require('gulp');

var runtime = require('../gulp-runtime');
var util = require('runtime/lib/utils');
var warning = require('runtime/lib/command/warning');

var ansiJS = require('ansi-highlight');

runtime.set('log', function(argv, args, next){

  var tasks = argv;
  var color = is(args.color);

  tasks = tasks.filter(function(taskName){
    return gulp.tasks[taskName];
  });

  if(tasks.length !== 0){
    tasks.forEach(function(taskName){

      var task = gulp.tasks[taskName];

      var str = '\ngulp.task(\'' + task.name + '\',' +
          JSON.stringify(task.dep) +', ' +
          (''+task.fn) + ');\n';

      str.replace(/\n/g, '\n  ');

      if( color.undefined || color.true )
        console.log( ansiJS(str) );
      else
        console.log(str);
    });

    runtime.prompt();
  }
  else {
    warning(' No task with `'+argv[0]+'` name');
    runtime.prompt();
  }

});
