
/*
 * module dependencies
 */
var is = require('utils-type');
var ansiJS = require('ansi-highlight');
var gulp = require('gulp');

var runtime = require('../gulp-runtime');

runtime.set('log', function logTasks(argv, args, next){

  var tasks = argv;
  var colorIs = is(args.color);

  tasks = tasks.filter(function(taskName){
    return gulp.tasks[taskName];
  });

  if(tasks.length !== 0){

    tasks.forEach(function(taskName){

      var task = gulp.tasks[taskName];
      var str = ('\ngulp.task(\'' + task.name + '\',' +
          JSON.stringify(task.dep) +', ' +
          (''+task.fn) + ');\n').replace(/\n/g, '\n  ');

      if( colorIs.true || colorIs.undefined )
        console.log( ansiJS(str) );
      else
        console.log(str);
    });
  }
  else
    console.warn('No task with name `'+argv.slice(-1)[0]+'`');

  runtime.prompt();
});
