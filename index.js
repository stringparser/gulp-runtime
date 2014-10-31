'use strict';

var runtime = require('runtime');
var util = require('runtime/lib/utils');

// <~> - <~>
// make a repl by default
// if not input and output will be through streams
// <~> - <~>

var instance;
var argv = util.argv(process.argv);
if( argv.repl === 'false' ){
  instance = runtime.create('gulp');
} else {
  instance = runtime.create('gulp', {
     input : process.stdin,
    output : process.stdout
  });
}

instance.require('./lib/utils');
instance.require('./lib/init');
instance.require('./lib/repl');

module.exports = instance;
