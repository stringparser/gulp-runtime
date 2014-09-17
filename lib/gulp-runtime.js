
'use strict';

var runtime = module.exports = require('runtime').create('gulp');

require('./utils');

runtime.require('./_config');
runtime.require('./gulp-cli');
runtime.require('./commands');
