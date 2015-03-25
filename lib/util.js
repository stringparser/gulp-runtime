'use strict';

// dependencies
//
var gutil = require('gulp-util');
var rutil = require('runtime/lib/util');

exports = module.exports = {};

// shortcuts
//
exports.log = gutil.log;
exports.color = gutil.colors;
exports.PluginError = gutil.PluginError;

exports.type = rutil.type;
exports.hrtime = rutil.hrtime;
exports.prettyTime = rutil.prettyTime;
