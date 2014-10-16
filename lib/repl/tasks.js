'use strict';


/**
 * Module dependencies
 */
var runtime = require('runtime').get('gulp');


/*
 * tasks at runtime
 * this function is also the root handler
 * which means that all not collected anywhere
 * else will end up here and be dispached! :)
 * the function also consumes the arguments! :D
 * this is reaaally good to know
 * TODO: review this function and make it fast
 */
runtime.set(function taskRunner(argv, args, next){

  var gulp = require('gulp');

  var index = argv.indexOf('default');
  if( index > -1 ){
    argv.splice(index, 1);
    runtime.emit('message', {
       prompt : argv[0] ? false : true,
      message : 'The `default` task is not avaliable at runtime'
    });
  }

  var tasks = argv;
  var notFound = [];
  tasks = tasks.filter(function(name, index){
    if( !gulp.tasks[name] ){
      notFound.push(name);
      return false;
    }
    // consume those arguments
    argv.splice(index, 1);
    return true;
  });

  var sink;
  try {
    sink = !tasks[0] || gulp.start.apply(gulp, tasks);
  } catch(err){
    runtime.emit('message', {
      throw : true,
      error : err
    });
    return ;
  }
  next(argv, args);
});
