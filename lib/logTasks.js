'use strict';

var util = require('./util');

exports = module.exports = logTasks;

function logTasks(app) {
  var tree = util.taskTree(app.store.children);
  var configFile = util.tildify(process.argv[1]);
  tree.label = 'Tasks for ' + util.color.magenta(configFile);

  util.archy(tree).split('\n').forEach(function (v) {
    if(!v.trim().length) { return ; }
    util.log(v);
  });
}
