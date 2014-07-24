
// module dependencies
var ansiJS = require('ansi-highlight');
var gutil = require('gulp-util');
var childGulp = require('../util/childGulp');
var printTask = require('../util/printTask');

// initial runtime commands
// in this module there should be no `gulp` required
module.exports = function runtimeCommands(runtime, gulp){

  runtime.set('show', function(args, gulp){

    var taskName = args.cmd[0];
    if(!taskName)
      return 'Provide a task name to print';
    else if(!gulp.tasks[taskName])
      return (
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
  })


}