
'use strict';

var runtime = module.exports = require('runtime').create('gulp');

require('./utils');

runtime.require('./config');
runtime.require('./gulp-bin');
runtime.require('./commands');
