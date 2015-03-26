'use strict';

exports = module.exports = {};

// dependencies
//

exports.log = require('gulp-util/lib/log');
exports.type = require('runtime/node_modules/utils-type');
exports.color = require('gulp-util/node_modules/chalk');
exports.prettyTime = require('runtime/node_modules/pretty-hrtime');
exports.PluginError = require('gulp-util/lib/PluginError');

// lazyness
//
exports.lazy = function(pack, runtime){
  switch(pack){
    case 'tasks-flags':
      exports.archy = require('archy');
      exports.tildify = require('tildify');
      exports.taskTree = require('./taskTree');
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
