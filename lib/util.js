'use strict';

exports = module.exports = {};

// dependencies
//
var gutil = require('gulp-util');
var rutil = require('runtime/lib/util');

// lazy
exports.lazy = function(pack, runtime){
  switch(pack){
    case 'tasks-flags':
      exports.logTasks = require('./logTasks');
      exports.logTasksSimple = require('./logTasksSimple');
    break;
    case 'require-flags':
      exports.tildify = require('tildify');
    break;
    default:
      exports.semver = require('semver');
      runtime.set({GULP_ENV: require('whech').sync('gulp')});
  }

};

// shortcuts
//
exports.log = gutil.log;
exports.color = gutil.colors;
exports.PluginError = gutil.PluginError;

exports.type = rutil.type;
exports.hrtime = rutil.hrtime;
exports.prettyTime = rutil.prettyTime;
