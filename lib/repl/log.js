
'use strict';

/*
 * module dependencies
 */

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

runtime.set(['-l','--log'], function logTasks(argv, args, next){
  var gulp = require('gulp');
  var colorIs = util.type(args.color);

  argv = argv.filter(function(arg){
    var task = gulp.tasks[arg];
    if( task ){
      var str = (
        '\ngulp.task(\'' + task.name + '\',' +
        JSON.stringify(task.dep) +', ' +
        (''+task.fn) + ');\n'
      ).replace(/\n/g, '\n  ');

      if( colorIs.true || colorIs.undefined ){
        str = util.ansiJS(str);
      }
      runtime.output.write(str+'\n');
      return false;
    }
    return true;
  });
  // pass it
  if( argv.length ){  next(argv);  }
});
