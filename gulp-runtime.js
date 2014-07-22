'use strict';

// Module dependencies
var gulp = require('gulp');
  , plumber = require('sculpt')
  , lib = require('./lib')
  , utils = require('./utils')
  , promptText = utils.promptText;

// runtime hooks
function runtime(){

  var runtime = {};

  // - attach current gulp instance
  // - provide manager
  runtime.instance = gulp;
  runtime.manager = lib.manager(runtime);
  runtime.onEnd = gulp.doneCallback = function onEndTasks(){
    stdout.write(promptText)
  };

  stdin.pipe(
    plumber.map(runtime.manager)
  ).pipe(stdout);

  return runtime;
}

// Expose `runtime`
module.exports = runtime;

// helpers
var stdin = process.stdin
  , stdout = process.stdout
  , stderr = process.stderr;

// utf8 encoding for stdin
stdin.setEncoding('utf8');
