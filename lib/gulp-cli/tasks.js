'use strict';


/**
 * Module dependencies
 */
var runtime = require('runtime').get('gulp');
var debug = require('debug')('gr:tasks');

/*
 * Add tasks to completion
 */
process.nextTick(function(){
  var gulp = require('gulp');
  runtime.set({ completion : Object.keys(gulp.tasks) });
});


/*
 * tasks at runtime
 */
runtime.set(function taskRunner(argv){

  if( process.env.NODE_ENV === 'test' && process.env.RUNTIME ){
    return ;
  }

  var tasks = argv;
  var gulp = require('gulp');
  var status = runtime.config('status');

  tasks = tasks.filter(function(name){

    debug('status : ', status ? status : 'no status yet' );
    if(name !== 'default'){
      return gulp.tasks[name];
    } else {
      runtime.emit('message', {
        prompt : true,
        message : 'the `default` task is not avaliable at runtime.'
      });
      return false;
    }
  });

  if( tasks[0] ){

    process.nextTick(function(){
      try {
        gulp.start.apply(gulp, tasks);
      } catch(err){
        runtime.emit('message', {
          throw : true,
          error : err
        });
      }
    });

    return ;
  }

  if( !argv.join('|').match('default') ){
    runtime.emit('message', {
       prompt : true,
      message : 'Task `'+argv+'` not found'
    });
  }
});
