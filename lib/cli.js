'use strict';

var util = require('./util');
var path = require('path');

exports = module.exports = function(gulp){

  // when the gulpfile is passed as argument default to process.argv
  if(!gulp.argv && (process.argv[1] === gulp.gulpfile || util.fromGulpBin)){
    gulp.argv = process.argv.slice(2);
  } else {
    gulp.argv = util.type(gulp.argv).array;
  }

  gulp.task(':cli(--silent)', function(next){
    gulp.log = false;
    util.log = util.gutil.log = util.silent;
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
    var options = {
      simple: this.params.cli === '--tasks-simple'
    };

    if(options.simple){
      console.log(gulp.tree(options).join('\n'));
    } else if(gulp.log){
      var tree = util.archy(
        gulp.tree({label: 'Tasks for ' + util.format.path(gulp.gulpfile)})
      );

      tree.split('\n').forEach(function(line){
        if(line.trim()){ util.log(line); }
      });
    }

    next();
  });

  if(gulp.argv && gulp.argv.length){
    if(gulp.repl){
      gulp.repl.emit('line', argv.join(' '));
    } else {
      gulp.start.apply(gulp, argv);
    }
  }

};
