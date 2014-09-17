
'use strict';

require('./utils');

var runtime = module.exports = require('runtime').create('gulp');

runtime.require('./_config');
runtime.require('./gulp-cli');
runtime.require('./commands');
