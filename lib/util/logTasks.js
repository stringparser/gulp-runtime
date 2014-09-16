'use strict';

var util = require('runtime/lib/utils');

exports = module.exports = logTasks;

function logTasks(env, localGulp) {

  var chalk = util.colors;
  var tree = util.taskTree(env, localGulp);

  tree.label = 'Tasks for ' +
    chalk.magenta(
      util.tildify(env.gulpfile, chalk)
    );

  util.archy(tree)
    .split('\n').forEach(function (v) {
      if (v.trim().length === 0) {
        return ;
      }
      util.log(v);
    });
}
