
/*
 * module dependencies
 */
var gulp = require('gulp');
var runtime = require('../gulp-runtime');
var warning = require('runtime/command/warning');
var ansiJS = require('ansi-highlight');

runtime.set('log', function(argv, args, next){

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

      if(args.color)
        console.log( ansiJS(str) );
      else
        console.log(str);
    });
  }
  else {
    Warning(' No task with `'+argv[0]+'` name');
  }

});