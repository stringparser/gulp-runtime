
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var runtime = require('../gulp-runtime');

var chalk = gutil.colors;

/*
 * file flags
 */

runtime.set(['--require', '--gulpfile'], function gulpfile(argv, args, next){

  var file = args.require || args.gulpfile;
  var tildify = require('gulp/node_modules/tildify');

  if( file ){

    file = path.resolve(file);
    runtime.require(file);

    gutil.log('Using gulpfile',
      chalk.magenta(tildify(file))
    );
  }
  else {
    gutil.log(
      chalk.yellow('runtime') + ' -> ' +
      'Something went wrong requiring your file.' +
      'Report this issue on github https://github.com/stringparser/gulp-runtime/issues'
    );
  }

  runtime.prompt();
});
