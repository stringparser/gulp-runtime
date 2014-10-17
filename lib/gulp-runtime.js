
'use strict';

var runtime = require('runtime').create('gulp');

runtime.require('./utils');
runtime.require('./config');
runtime.require('./repl');

module.exports = runtime.repl(true);
