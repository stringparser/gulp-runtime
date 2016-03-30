'use strict';

var path = require('path');
var Runtime = require('runtime');

var util = require('./util');
var logger = util.log;
var silent = function(){};

exports = module.exports = function(gulp, argv){

  gulp.task(':cli(default)', function(next){
    logger('no default task defined in %s',
      util.format.file(gulp.gulpfile)
    );

    if(!gulp.repl){
      process.exit(1);
    } else {
      next();
    }
  });

  gulp.task(':cli(--silent)', function(next){
    if(util.log === silent){
      gulp.log = true;
      util.log = logger;
      util.log('logging restored');
    } else {
      gulp.log = false;
      util.log = silent;
    }
    next();
  });

  gulp.task(':cli(--version|-v)', function(next){
    var packagePath = require.resolve('../package.json');
    util.log('version %s (%s)',
      require(packagePath).version,
      util.format.file(path.dirname(packagePath))
    );
    next();
  });

  gulp.task(':cli(--cwd) :dirname', function(next){
    var dirname = path.resolve(this.params.dirname);
    if(process.cwd() !== dirname){
      process.chdir(dirname);
      util.log('cwd changed to %s', dirname);
    }
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
      console.log(Object.keys(gulp.tasks.store).join('\n').trim());
    } else if(gulp.log){

      var taskTree = {
        label: 'Tasks for ' + util.format.file(gulp.gulpfile),
        nodes: []
      };

      Object.keys(gulp.tasks.store).forEach(function(name){
        var task = gulp.tasks.store[name];
        if(!task.fn){ return; }
        taskTree.nodes.push(task.fn.stack instanceof Runtime.Stack
          ? task.fn.stack.tree()
          : {label: task.name}
        );
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
      gulp.stack.apply(gulp, argv)();
    }
  }
};
