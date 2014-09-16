'use strict';

//
// ## all utils in the same object to prevent
//    big header of requires in each file

var gutil = require('gulp-util');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var copy = util.merge({ }, gutil);

exports = module.exports = { };

exports.prettyTime = require('pretty-hrtime');
exports.archy = require('archy');

util.merge(exports, copy);
util.merge(exports, runtime.require('./util'));
util.merge(util, exports);
