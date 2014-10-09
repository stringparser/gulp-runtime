
'use strict';

var runtime = require('runtime').create('gulp');

require('./utils');

runtime.require('./config');
runtime.require('./gulp-bin');
runtime.require('./command');

module.exports = runtime;
