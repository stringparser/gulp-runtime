
'use strict';

var runtime = require('runtime').create('gulp');

runtime.require('./utils.js');
runtime.require('./config');
runtime.require('./repl');

module.exports = runtime;
