

var runtime = require('../gulp-runtime');
var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = gutil.colors;

/*
 * file flags
 */

runtime.set(['--color', '--no-color'], function(){})
runtime.set('--silent', function(){})
runtime.set(['--require', '--gulpfile'], function(argv, args, next){

  var file = args.r ? args.r : (
    args.gf ? agrs.gf : (
      args.require ? args.require : (
        args.gulpfile ? args.gulpfile : null
      )
    )
  );

  if(file !== null){

    try {
      require(file);
    }
    catch(error){
      gutil.log(
        chalk.yellow('runtime') + ' -> ' +
        error.message.replace(/(')(\S+)(')/g, function($0,$1,$2,$3){

          return $1 + chalk.red($2) + $3;
        })
      );
    }

    var env = this.config('env');

    gutil.log('Using gulpfile', chalk.magenta(tildify(env.PWD)));
  }
  else {
    gutil.log(
      chalk.yellow('runtime') + ' -> ' +
      'Something went wrong requiring your file.' +
      'Report this issue on Github.'
    );
  }

});
