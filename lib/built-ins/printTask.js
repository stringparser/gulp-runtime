
/*
 * module dependencies
 */
var gulp = require('gulp');

var runtime = require('../gulp-runtime');
var util = require('runtime/lib/utils');
var warning = require('runtime/lib/command/warning');

var ansiJS = require('ansi-highlight');

runtime.set('log', function(argv, args, next){

  console.log(args)
  var tasks = argv;

  tasks = tasks.filter(function(taskName){
    return gulp.tasks[taskName];
  })

  if(tasks.length !== 0){
    tasks.forEach(function(taskName){

      var task = gulp.tasks[taskName];

      var str = '\ngulp.task(\'' + task.name + '\','
          + JSON.stringify(task.dep) +', '
          + (''+task.fn) + ');\n';

      str.replace(/\n/g, '\n  ');

      if(util.isUndefined(args.color) || args.color)
        console.log( ansiJS(str) );
      else
        console.log(str);
    });

    if(argv.indexOf('default') !== -1)
      argv.splice(argv.indexOf('default'), 1);
  }
  else {
    Warning(' No task with `'+argv[0]+'` name');
  }

});