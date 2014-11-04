'use strict';

// <~> - <~>
// make a repl by default
// if not input and output will be through streams
// <~> - <~>
var argv = process.argv.slice(2);
var runtime =  require('runtime')
  .create('gulp', argv.indexOf('--silent') > -1 || {
     input : process.stdin,
    output : process.stdout
  });

runtime.require('./lib/util');
runtime.require('./lib/init');
runtime.require('./lib/repl');

module.exports = runtime.get('gulp');
