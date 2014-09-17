'use strict';


/**
 * Module dependencies
 */
var runtime = require('runtime').get('gulp');


/*
 * tasks at runtime
 */
runtime.set(function taskRunner(argv){

  var tasks = argv;
  var gulp = require('gulp');

  var notFound = [];
  tasks = tasks.filter(function(name){
    if( !gulp.tasks[name] ){
      notFound.push(name);
      return false;
    }
    return true;
  });

  var index = tasks.indexOf('default');
  if( index > -1 ){
    tasks.splice(index, 1);
    runtime.emit('message', {
       prompt : !tasks[0] && !notFound[0] ? true : false,
      message : 'The `default` task is not avaliable at runtime'
    });
  }

  if( notFound[0] ){
    runtime.emit('message', {
       prompt : !tasks[0] ? true : false,
      message : 'Task' + (notFound[1] ? 's' : '') +
        ' `'+notFound.join(', ')+'` do not exist'
    });
  }

  if( tasks[0] ){

    try {
      gulp.start.apply(gulp, tasks);
    } catch(err){
      runtime.emit('message', {
        throw : true,
        error : err
      });
    }
  }
});
