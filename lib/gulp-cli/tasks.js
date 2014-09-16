'use strict';


/**
 * Module dependencies
 */
var gulp = require('gulp');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');
var debug = require('debug')('gr:tasks');

/*
 * Add tasks to completion
 */
process.nextTick(function(){
  runtime.set({ completion : Object.keys(gulp.tasks) });
});

/*
 * task flags
 */
var flags = ['ls', '--tasks', '-T', '--tasks-simple'];

runtime.set(flags, function taskLog(argv, args){

  var tasksSimple = args['tasks-simple'];
  var env = runtime.config('env');

  if(tasksSimple){
    util.logTasksSimple(env, gulp);
  } else {
    util.logTasks(env, gulp);
  }

  runtime.prompt();
});


/*
 * tasks at runtime
 */
runtime.set(function taskRunner(argv){

  if( process.env.NODE_ENV === 'test' && process.env.RUNTIME ){
    return ;
  }
  
  var tasks = argv;
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
    try {
      gulp.start.apply(gulp, tasks);
    } catch(err){

      err.message += '\n Error while `starting` a task. ';
      err.limit = Infinity;

      runtime.emit('message', { error : err });
    }

    return ;
  }

  if( !argv.join('|').match('default') ){
    runtime.emit('message', {
       prompt : true,
      message : 'Task `'+argv+'` not found'
    });
  }
});
