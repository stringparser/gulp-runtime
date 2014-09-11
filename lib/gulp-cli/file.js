
var runtime = require('../gulp-runtime');

/*
 * file flags
 */
var flags = ['--require', '--gulpfile'];

runtime.set(flags, function (argv, args, next){

  var path = require('path');
  var gutil = require('gulp-util');
  var chalk = gutil.colors;

  var file = args.require || args.gulpfile;

  if( file ){

    var tildify = require('tildify');

    file = path.resolve(file);

    runtime.require(file);

    gutil.log(
      args.gulpfile ? 'Using gulpfile' : 'Requiring external module',
      chalk.magenta( tildify(file) )
    );
  }
  else {
    gutil.log(
      chalk.yellow('runtime') + ' -> ' +
      'Something went wrong requiring your file.' +
      'Report this issue on github '+     'https://github.com/stringparser/gulp-runtime/issues'
    );
  }

  runtime.prompt();
});
