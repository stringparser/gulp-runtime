'use strict';

// Module dependencies
var spawn = require('child_process').spawn
  , plumber = require('sculpt')
  , lib = require('./lib');

// helpers
var stdin = process.stdin
  , stdout = process.stdout
  , stderr = process.stderr;

// utf8 encoding for stdin
stdin.setEncoding('utf8');

// expose `runtime`
module.exports = function (gulp){

  var runtime = {};

  // attach current instance and provide manager
  runtime.instance = lib.instance(gulp);
  runtime.manager = lib.manager(runtime);

  stdin.pipe(
    plumber.map(runtime.manager)
  ).pipe(stdout);

  return runtime;
}

