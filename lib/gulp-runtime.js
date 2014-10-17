
'use strict';
var runtime = require('runtime').create('gulp');

runtime.require('./utils');
runtime.require('./config');
runtime.require('./repl');

var argv = runtime.parser(process.argv);
if( argv.repl === 'false' ){
  runtime.repl(false);
} else {
  runtime.repl(true);
}

module.exports = runtime;
