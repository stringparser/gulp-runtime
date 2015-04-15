'use strict';

exports = module.exports = {};

// dependencies
//
exports.date = require('dateformat');
exports.type = require('utils-type');
exports.archy = require('archy');
exports.color = require('chalk');
exports.tildify = require('tildify');
exports.prettyTime = require('pretty-hrtime');

// various shortcuts/helpers
//

exports.color.file = function(filename){
  return this.magenta(exports.tildify(filename));
};

exports.color.time = function(time){
  var t = exports.prettyTime(process.hrtime(time || [0,0]));
  return this.magenta(t);
};

exports.color.callersPath = function(error, index){
  index = Number(index) || 1;
  var match = error.stack.match(/([^( )]+:\d+:\d+)/g);
  var file = (match || '')[index];
  if(!file){ return ; }

  error.stack = error.stack.replace(file, this.file(file)) + '\n';
};

// logging
//
exports.log = function(/* arguments */){
  var date = this.date(new Date(), 'HH:MM:ss');
  process.stdout.write('[' + this.color.grey(date) + '] ');
  console.log.apply(console, arguments);
};

exports.logTasksSimple = function(app) {
  console.log(
    Object.keys(app.store.children)
          .join('\n')
          .trim()
  );
};

exports.taskTree = function(tasks) {
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

exports.logTasks = function(app) {
  var tree = this.taskTree(app.store.children);
  var configFile = this.tildify(process.argv[1]);
  tree.label = 'Tasks for ' + this.color.magenta(configFile);

  this.archy(tree).split('\n').forEach(function (v) {
    if(!v.trim().length) { return ; }
    exports.log(v);
  });
};
