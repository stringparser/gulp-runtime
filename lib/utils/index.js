/**
 *
 */
function logTasksSimple(env, localGulp) {
  console.log(
    Object.keys(localGulp.tasks)
      .join('\n').trim()
  );
}
exports.logTasksSimple = logTasksSimple;

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
exports.logTasks = logTasks;

/**
 *
 */
function taskTree(env, localGulp) {

  var tasks = localGulp.tasks;
  return Object.keys(tasks)
    .reduce(function (prev, task) {
      prev.nodes.push({
        label: task,
        nodes: tasks[task].dep
      });
      return prev;
    }, {
      nodes: []
  });
}
exports.taskTree = taskTree;
