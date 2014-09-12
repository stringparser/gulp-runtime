/**
 *
 */

module.exports = taskTree;

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
