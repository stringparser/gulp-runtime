
'use strict';

var runtime = require('runtime').set('gulp');

runtime.require('./utils');
runtime.require('./config');
runtime.require('./repl');

module.exports = runtime;
