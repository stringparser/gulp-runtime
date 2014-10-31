'use strict';

var util = require('runtime/lib/utils');

// <~> - <~>
// make a repl by default
// if not input and output will be through streams
// <~> - <~>

var argv = util.argv(process.argv);
var runtime =  require('runtime')
  .create('gulp', argv.silent || {
     input : process.stdin,
    output : process.stdout
  });


//
// ## save environment before init
//
var env = util.whech.sync('gulp');
runtime.config('env', util.merge(env, argv));

runtime.require('./lib/utils');
runtime.require('./lib/init');
runtime.require('./lib/repl');

module.exports = runtime;
