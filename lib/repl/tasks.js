'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

/*
 * tasks at runtime
 * ------
 * this is also the root handler
 * non handled commands will end up here
 */

runtime.set(function taskRunner(argv, args, next){
  var tasks = [ ];
  var gulp = require('gulp');
  var silent = runtime.config('silent');

  // consuming arguments
  argv = argv.filter(function(name){
    if( !gulp.tasks[name] ){ return true; }
    tasks.push(name);
  });

  // not found
  var chalk = util.colors;
  if( argv.length ){
    var notDefault = argv.indexOf('default') < 0;
    var notDefined = !runtime.get(argv)._depth;
    if( notDefined && notDefault){
      runtime.emit('message', {
        message : ' command \''+argv.join(' ')+'\' not found ',
        quotify : 'red',
         prompt : tasks.length ? false : true
      });
    } else if( !notDefault ){
      runtime.emit('message', {
        message :
          chalk.red('Task \'default\' is not in your gulpfile') + '\n' +
          'Please check the documentation for proper gulpfile formatting',
        stamp : true
      });
      process.exit(1);
    } else {  next(argv);  }
  }

  // dispatch tasks
  if( tasks.length ){
    try { gulp.start.apply(gulp, tasks); }
    catch(err){
      runtime.emit('message', {
        error : err, throw : true
      });
    }
  }

  if( silent || !argv.length && !tasks.length ){
    return runtime.prompt();
  }
});
