'use strict';

var util = require('./util');
var path = require('path');

var gulpfile = path.resolve(process.argv[1]);

exports = module.exports = function(gulp){

  // when the gulpfile is passed as argument default to process.argv
  if(!gulp.argv.length && gulpfile === gulp.gulpfile){
    gulp.argv = process.argv.slice(2);
  }

  if(!/(^|[\s])/.test(util.xargs)){
    gulp.argv.unshift('--cwd ' + path.dirname(gulp.gulpfile));
  }

  gulp.task(':cli(--silent)', function(next){
    gulp.log = false;
    util.log = util.gutil.log = util.silent;
    next();
  });

  gulp.task(':cli(--version|-v)', function(next){
    util.log('gulp-runtime version %s', require('../package.json').version);
    next();
  });

  gulp.task(':cli(--cwd) :dirname(\\S+)', function(next){
    var dirname = path.resolve(this.params.dirname);

    if(process.cwd() !== dirname){
      process.chdir(dirname);
      util.log('cwd changed to %s', util.format.path(dirname));
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
    var taskTree = gulp.tree({
      label: 'Tasks for ' + util.format.path(gulp.gulpfile),
      simple: this.params.cli === '--tasks-simple'
    });

    if(this.params.cli === '--tasks-simple'){
      console.log(taskTree.join('\n'));
    } else if(gulp.log){
      util.archy(taskTree).trim().split('\n').map(function(line){
        util.log(line);
      });
    }

    next();
  });

  if(gulp.argv.length){
    if(gulp.repl){
      gulp.repl.emit('line', gulp.argv.join(' '));
    } else {
      gulp.start.apply(gulp, gulp.argv);
    }
  }

};
