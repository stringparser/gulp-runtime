'use strict';

var util = require('runtime/lib/utils');
util.requirem('./lib/utils');

//
// ## do not wait for startup
//    to stop everything

var chalk = util.colors;
var env = util.whech.sync('gulp');
if( !env.localPackage.version && !env.globalPackage.version ){
  util.log(chalk.red('gulp is not installed locally or globally'));
  util.log('Try running: npm install gulp');
  process.exit(1);
}

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

// save environment before init
runtime.config('env',
  util.merge(env, runtime.parser(argv)) );

// startup
runtime.require('./lib/init');
runtime.require('./lib/repl');

module.exports = runtime;
