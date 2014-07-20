'use strict';

// Module dependencies
var spawn = require('child_process').spawn
  , plumber = require('sculpt')
  , lib = require('./lib');

// helpers
var stdin = process.stdin
  , stdout = process.stdout
  , stderr = process.stderr;

// expose `runtime`
module.exports = function (gulp){

  var runtime = {};

  // attach current instance
  runtime.instance = gulp;
  // make a manager
  runtime.manager = lib.manager(runtime);

  // set encoding & pipe!
  stdin.setEncoding('utf8');
  stdin.pipe(
    plumber.map(runtime.manager)
  ).pipe(stdout);

  console.log(stdout)

  return runtime;
}

