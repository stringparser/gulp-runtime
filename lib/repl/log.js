
'use strict';

/*
 * module dependencies
 */

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

runtime.set('--log', function logTasks(argv, args, next){
  var gulp = require('gulp');
  var env = runtime.config('env');

  argv = argv.filter(function(arg){
    var task = gulp.tasks[arg];
    if( task ){
      var str = (
        '\ngulp.task(\'' + task.name + '\',' +
        JSON.stringify(task.dep) +', ' +
        (''+task.fn) + ');'
      ).replace(/\n/g, '\n  ');

      if(!args.noColor && !env.noColor){
        str = util.ansiJS(str);
      } else {
        argv.splice(argv.indexOf('--no-color'), 1);
      }

      runtime.output.write(str + '\n\n');
      return false;
    }
    return true;
  });
  // pass it
  next(argv);
});
