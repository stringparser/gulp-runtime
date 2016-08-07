'use strict';

var util = require('./util');
var path = require('path');

var argv = process.argv.slice(2);

exports = module.exports = function (gulp) {

  gulp.task(':cli(--silent)', function (next) {
    gulp.log = false;
    util.log = util.gutil.log = util.silent;
    next();
  });

  gulp.task(':cli(--version|-v)', function (next) {
    util.log('gulp-runtime version', require('../package.json').version);
    next();
  });

  gulp.task(':cli(--cwd) :dirname(\\S+)', function (next) {
    var dirname = path.resolve(this.params.dirname);
    if (process.cwd() !== dirname) {
      process.chdir(dirname);
      util.log('cwd changed to', util.format.path(dirname));
    }
    next();
  });

  gulp.task(':cli(--no-color|--color)', function (next) {
    util.chalk.enabled = Boolean(this.params.cli === '--color');
    if (util.chalk.enabled) {
      util.log('colors', util.chalk.green('enabled'));
    }
    next();
  });

  gulp.task(':cli(--tasks-simple|--tasks|-T)', function (next) {
    var taskTree = gulp.tree({
      label: 'Tasks for ' + util.format.path(gulp.gulpfile),
      simple: this.params.cli === '--tasks-simple'
    });

    if (this.params.cli === '--tasks-simple') {
      console.log(taskTree.join('\n'));
    } else if (gulp.log) {
      util.archy(taskTree).trim().split('\n').map(function (line) {
        util.log(line);
      });
    }

    next();
  });

  gulp.task(':cli(--require) :file(\\S+)', function (next) {
    var filename = path.resolve(this.params.file);
    util.log('loading', util.format.path(filename));

    try {
      var filename = require.resolve(filename);

      if (require.cache[filename]) {
        delete require.cache[filename];
      }

      require(filename);
    } catch (err) {
      console.log(util.format.error(err.message));
    }

    next();
  });

  // skip running tasks if the file was not run from the CLI
  if (!util.isFromCLI(gulp)) {
    return;
  }

  // give some time to have all tasks defined
  process.nextTick(function () {
    var dirname = path.dirname(gulp.gulpfile);

    // change CWD to the gulpfile's if applies
    if (!/(^|[\s])(--cwd)/.test(argv.join(' ')) && process.cwd() !== dirname) {
      process.chdir(dirname);
      util.log('cwd changed to', util.format.path(dirname));
    }

    if (!argv.length) {
      argv = ['default'];
    }

    if (gulp.repl) {
      gulp.repl.emit('line', argv.join(' '));
    } else {
      gulp.start.apply(gulp, argv);
    }
  });
};
