'use strict';

// Module dependencies
var gutil = require('gulp-util');
var PluginError = require('gulp-util').PluginError;
var color = require('gulp-util').colors;
var createInterface = require('./interface');
var instance = require('./instance');
var commands = require('./commands');

// Expose `runtime`
module.exports = function createRuntime(gulp){

  var runtime = {
    __proto__ : createInterface({
      name : 'gulp-runtime',
      promptText : ' > gulp '
    }, gulp)
  };

  instance(runtime, gulp);
  commands(runtime, gulp);

  gulp.doneCallback = runtime.doneCallback = function gulpDoneCallback(){

    setTimeout(function(){
      runtime.prompt();
    }, 500)
  }

  return runtime;
}