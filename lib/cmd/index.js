
/*
 * Module dependencies
 */
var gulp = require('gulp');
var gutil = require('gulp-util');
var runtime = require('./gulp-runtime')
var RuntimeWarning = require('./runtime-warning');

var prettyfy = require('../util/prettyfy');
var ansiJS = require('ansi-highlight');
var childGulp = require('../util/childGulp');
var printTask = require('../util/printTask');

// initial runtime commands
// in this module there should be no `gulp` required
module.exports = function runtimeCommands(runtime){

  runtime.set('print', function(cmd, args, next){

    var taskName = args.argv[1];

    if(!taskName)
      return 'Provide a task name to print';
    else if(!gulp.tasks[taskName])
      return RuntimeWarning(
        'task "'+taskName+'" is not defined.\n'
        + 'Use `gulp -T` to see the defined task tree.'
      );
    else {

      var task = gulp.tasks[taskName];
      var strDeps = ' '+JSON.stringify(task.dep) + ','
      , strTaskFn = (' '+task.fn).toString();

      var str = '\ngulp.task(\'' + task.name + '\',';
          str += strDeps + strTaskFn + ');\n'

      var withColor = !args.param.hasOwnProperty('color');
      if(withColor) // defaults to colorized output
        console.log(ansiJS(str));
      else
        console.log(str);
    }

    runtime.emit('done')
  })

  runtime('tasks', function(){
    prettyfy.color(gulp.tasks)
  })

  var self = this;
  var tasks = Object.keys(gulp.tasks);

  tasks.forEach(function(taskName){
    runtime(taskName, function(){
      gulp.start(taskName);
    })
  })
}