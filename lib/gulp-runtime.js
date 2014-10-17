
'use strict';

var runtime = require('runtime').create('gulp');

runtime.require('./utils');
runtime.require('./config');
runtime.require('./repl');

runtime.config('repl', true);
runtime.repl();

module.exports = runtime;
