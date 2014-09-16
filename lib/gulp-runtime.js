
'use strict';

var runtime = module.exports = require('runtime').create('gulp');

runtime.require('./utils.js');
runtime.require('./_startup');
runtime.require('./gulp-cli');
runtime.require('./built-in');
