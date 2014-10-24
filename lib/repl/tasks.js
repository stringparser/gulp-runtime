'use strict';


/**
 * Module dependencies
 */
var runtime = require('runtime').get('gulp');


/*
 * tasks at runtime
 * this function is also the root handler
 * meaning... all not collected anywhere
 * else will end up here and be dispached! :)
 * the function also consumes the arguments! :D
 * this is reaaally good to news!
 */
runtime.set(function taskRunner(argv, args, next){
  var tasks = [];
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
        runtime.emit('message', { throw : true, error : err });
        return ;
      }
  }
  if( runtime.get(argv)._depth ){
    next(argv, args);
  } else if( argv[0] ){
    runtime.emit('message', {
      quotify : 'yellow',
      message : '  Command `'+argv.join(', ')+'` not found',
       prompt : true
    });
  }
});
