'use strict';

// Module dependencies
var gulp = require('gulp')
  , gutil = require('gulp-util')
  , initCli = require('./initCli');

// Expose `runtime`
module.exports = (function runtime(){

  var runtime = {
    cli : initCli(),
    done : function onEndTasks(){
      // there is a problem with this
      // hack : there should be a better way
      // i.e. using a setInterval for example
      // and checking number of tasks
      runtime.cli.prompt();

      return this;
    }
  }

  gulp.doneCallback = runtime.done;

  return runtime;
})()