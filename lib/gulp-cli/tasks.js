'use strict';


/**
 * Module dependencies
 */
var gulp = require('gulp');
var runtime = require('../gulp-runtime');

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

  var taskSimpleFlag = args['tasks-simple'];
  var testFlags = !args.T && !args.tasks && !taskSimpleFlag;

  if( args._.indexOf('ls') < 0 && testFlags ){
    return ;
  }

  var util = runtime.require('../utils');
  var env = runtime('env');

  if(taskSimpleFlag){
    util.logTasksSimple(env, gulp);
  } else {
    util.logTasks(env, gulp);
  }

  runtime.emit('message' , { prompt : true });
});


/*
 * tasks at runtime
 */
runtime.set(function taskRunner(argv){

  var gutil = require('gulp-util');
  var chalk = gutil.colors;

  var tasks = argv;

  tasks = tasks.filter(function(name){
    if(name !== 'default'){
      return gulp.tasks[name];
    } else {
      runtime.emit('message', {
        prompt : true,
        message : 'the `'+chalk.cyan('default')+'`'+
        ' task is not avaliable at runtime.'
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
