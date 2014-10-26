'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

/*
 * task flags
 */
var flags = ['--tasks', '-T', '--tasks-simple'];

runtime.set(flags, function taskLog(argv, args){
  var gulp = require('gulp');
  var env = runtime.config('env');

  if(args.tasksSimple){
    util.logTasksSimple(env, gulp);
  } else {
    util.logTasks(env, gulp);
  }

  runtime.prompt();
});
