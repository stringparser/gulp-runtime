'use strict';

var util = require('runtime/lib/utils');

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

runtime.require('./lib/utils');

//
// ## do not wait for startup
//

var chalk = util.colors;
var env = util.whech.sync('gulp');

if( !env.globalPackage.version ){
  runtime.config('env', { failed : true });
  util.log(util.badge);
  util.log(chalk.red('gulp is not installed globally'));
  util.log('Try running: npm install gulp');
  return process.exit(1);
}

if( !env.localPackage.version ){
  runtime.config('env', { failed : true });
  util.log(util.badge);
  util.log(chalk.red('gulp is not installed locally'));
  util.log('Try running: npm install gulp');
  util.log('If you have gulp installed globally');
  util.log('you can also run: npm link gulp');
  return process.exit(1);
}

//
// ## save environment before init
//

runtime.config('env', util.merge(env, runtime.parser(argv)));
runtime.require('./lib/init');
runtime.require('./lib/repl');

module.exports = runtime;
