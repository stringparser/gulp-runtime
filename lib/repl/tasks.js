'use strict';

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
  // consuming arguments
  argv = argv.filter(function(name){
    if( !gulp.tasks[name] ){ return true; }
    tasks.push(name);
  });
  // dispatch tasks
  if( tasks[0] ){
    try { gulp.start.apply(gulp, tasks); }
    catch(err){
      return runtime.emit('message', {
        error : err, throw : true
      });
    }
  }

  if( runtime.get(argv)._depth ){
    next(argv, args);
  } else if( argv[0] ){
    runtime.emit('message', {
      message : '  Command `'+argv.join(', ')+'` not found',
       prompt : true,
      quotify : 'yellow'
    });
  }
});
