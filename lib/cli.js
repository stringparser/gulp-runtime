'use strict';

var util = require('./util');
var path = require('path');
var Runtime = require('runtime');

exports = module.exports = function(gulp, argv){

  gulp.task(':cli(--silent)', function(next){
    gulp.log = false;
    util.log = util.gutil.log = silent;
    next();
  });

  gulp.task(':cli(--version|-v)', function(next){
    var packagePath = require.resolve('../package.json');
    util.log('version %s (%s)', require(packagePath).version);
    next();
  });

  gulp.task(':cli(--cwd) :dirname(\\S+)', function(next){
    var state = 'already set';
    var dirname = path.resolve(this.params.dirname);
    if(process.cwd() !== dirname){
      process.chdir(dirname);
      state = 'changed';
    }

    util.log('cwd %s to %s', state, util.format.path(dirname));
    next();
  });

  gulp.task(':cli(--no-color|--color)', function(next){
    util.chalk.enabled = Boolean(this.params.cli === '--color');
    util.log('colors', util.chalk.enabled
      ? util.format.enabled('enabled')
      : 'disabled'
    );
    next();
  });

  gulp.task(':cli(--tasks-simple|--tasks|-T)', function(next){

    if(this.params.cli === '--tasks-simple'){
      process.stdout.write(Object.keys(gulp.tasks.store).join('\n'));
    } else if(gulp.log){

      var taskTree = {
        label: 'Tasks for ' + util.format.path(gulp.gulpfile),
        nodes: []
      };

      Object.keys(gulp.tasks.store).forEach(function(name){
        var task = gulp.tasks.store[name];

        if(task.fn.stack instanceof Runtime.Stack){
          var tree = task.fn.stack.tree();
          taskTree.nodes.push({
            label: name + (task.fn.stack.wait
              ? ':series(' + tree.label + ')'
              : ':parallel(' + tree.label + ')'
            ),
            nodes: tree.nodes
          });
        } else {
          taskTree.nodes.push({
            label: task.label || task.displayName || task.name
          });
        }
      });

      util.archy(taskTree).split('\n').forEach(function(line){
        if(line.trim()){ util.log(line); }
      });
    }

    next();
  });

  if(argv && argv.length){
    if(gulp.repl){
      gulp.repl.emit('line', argv.join(' '));
    } else {
      gulp.start.apply(gulp, argv);
    }
  }

};
