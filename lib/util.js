'use strict';

exports = module.exports = {};

// dependencies
//

exports.log = require('gulp-util/lib/log');
exports.type = require('tornado-repl/node_modules/utils-type');
exports.color = require('gulp-util/node_modules/chalk');
exports.tildify = require('tildify');
exports.prettyTime = require('pretty-hrtime');
exports.PluginError = require('gulp-util/lib/PluginError');

// shortcuts
//

exports.color.file = function(filename){
  return exports.color.magenta(exports.tildify(filename));
};

// lazyness
//
exports.lazy = function(pack){
  if(pack === 'tasks-flags'){
    exports.archy = require('archy');
    exports.taskTree = require('./taskTree');
    exports.logTasks = require('./logTasks');
    exports.logTasksSimple = require('./logTasksSimple');

  }
};
