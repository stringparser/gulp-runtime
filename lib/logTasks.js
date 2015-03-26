'use strict';

var util = require('./util');

exports = module.exports = logTasks;

function logTasks(env, localGulp) {

  var tree = util.taskTree(env, localGulp);

  tree.label = 'Tasks for ' +
    util.color.magenta(util.tildify(env.configFile));

  util.archy(tree)
    .split('\n').forEach(function (v) {
      if (v.trim().length === 0) {
        return ;
      }
      util.log(v);
    });
}
