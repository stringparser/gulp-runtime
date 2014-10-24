'use strict';

var util = require('runtime/lib/utils');

// make a repl by default
var argv = util.argv(process.argv);
if( argv.repl === void 0 ){
  process.argv.push('--repl');
}

var runtime = require('runtime').create('gulp');

runtime.require('./utils');
runtime.require('./config');
runtime.require('./repl');

module.exports = runtime;
