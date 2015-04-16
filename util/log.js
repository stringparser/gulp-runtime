'use strict';

var util = require('./.');

exports = module.exports = logger;

// logging
//
function logger(/* arguments */){
  var date = util.date(new Date(), 'HH:MM:ss');
  process.stdout.write('[' + util.color.grey(date) + '] ');
  console.log.apply(console, arguments);
}

// --task-simple helper
util.logTasksSimple = function(runtime) {
  console.log(
    Object.keys(runtime.store.children)
          .join('\n')
          .trim()
  );
};

// --task helper
util.taskTree = function(tasks) {
  return Object.keys(tasks)
    .reduce(function (prev, task) {
      prev.nodes.push({
        label: task,
        nodes: tasks[task].dep
      });
      return prev;
    }, {
      nodes: [ ]
  });
};

// --task helper
util.logTasks = function(runtime) {
  var tree = this.taskTree(runtime.store.children);
  var configFile = this.tildify(process.argv[1]);
  tree.label = 'Tasks for ' + this.color.magenta(configFile);
  require('archy')(tree).split('\n').forEach(function (v) {
    if(!v.trim().length) { return ; }
    util.log(v);
  });
};
