/**
 *
 */
var taskTree = require('./taskTree');


module.exports = logTasks;
/**
 *
 */
function logTasks(env, localGulp) {

  var gutil = require('gulp-util')
  var archy = require('archy');
  var tildify = require('tildify');
  var chalk = gutil.colors;

  var tree = taskTree(env, localGulp);
  tree.label = 'Tasks for ' + chalk.magenta(tildify(env.PWD));
  archy(tree)
    .split('\n').forEach(function (v) {
      if (v.trim().length === 0) {
        return;
      }
      gutil.log(v);
    });
}
