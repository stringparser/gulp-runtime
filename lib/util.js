'use strict';

exports = module.exports = {};

// dependencies
//
var gutil = require('gulp-util');
var rutil = require('runtime/lib/util');

// lazy
exports.lazy = function(pack){
  switch(pack){
    case 'tasks-flags':
      exports.logTasks = require('./logTasks');
      exports.logTasksSimple = require('./logTasksSimple');
    break;
    case 'require-flags':
      exports.tildify = require('tildify');
    break;
    default:
      exports.whech = require('whech');
      exports.semver = require('semver');
      process.env.GULP_ENV = exports.whech.sync('gulp');
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
