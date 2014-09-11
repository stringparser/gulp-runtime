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

  var tree = taskTree(localGulp.tasks);
  var chalk = require('gulp-util').colors;
  var archy = require('archy');

  tree.label = 'Tasks for ' + chalk.magenta(tildify(env.configPath));
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

  return Object.keys(localGulp.tasks)
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
