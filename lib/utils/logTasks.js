'use strict';

/**
 *
 */

var util = require('runtime/lib/utils');
var gutil = require('gulp-util');
var archy = require('archy');
var chalk = gutil.colors;

var taskTree = require('./taskTree');

exports = module.exports = logTasks;
/**
 *
 */
function logTasks(env, localGulp) {

  var tree = taskTree(env, localGulp);
  tree.label = 'Tasks for ' +
    chalk.magenta( util.tildify(env.gulpfile) );
    
  archy(tree)
    .split('\n').forEach(function (v) {
      if (v.trim().length === 0) {
        return ;
      }
      gutil.log(v);
    });
}
