'use strict';

// dependencies
//
var gutil = require('gulp-util');
var rutil = require('runtime/lib/util');

exports = module.exports = {};

// shortcuts
//
exports.log = gutil.log;
exports.color = gutil.color;
exports.PluginError = gutil.PluginError;

exports.hrtime = rutil.hrtime;
exports.prettyTime = rutil.prettyTime;
