'use strict';

var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = gutil.colors;

var util = require('runtime/lib/utils');
var runtime = require('../gulp-runtime');
var argv = util.args(process.argv.slice(2));

var modulePackage, cliPackage, env = { };

try {

  modulePackage = require('gulp/package');
  cliPackage = require('/usr/lib/node_modules/gulp/package');

  try {

    if(argv.gulpfile){
      env.gulpfile = argv.gulpfile;
    } else {
      env.gulpfile = require.resolve(
        path.resolve('.', 'gulpfile')
      );
    }

  } catch(err){

    env.gulpfile = path.resolve('.', 'gulpfile');

    gutil.log(
      chalk.red('No gulpfile found in '),
      chalk.magenta(util.tildify(env.gulpfile))
    );
    gutil.log(
      err
    );
  }

} catch(err){

  if(!modulePackage){
    gutil.log(
      chalk.red('Local gulp not found in'),
      chalk.magenta(util.tildify('gulp'))
    );
    gutil.log(chalk.red('Try running: npm install gulp'));
    process.exit(1);
  }

  if(!cliPackage){
    gutil.log(
      chalk.red('No global gulp found in'),
      chalk.magenta('/usr/lib/node_modules/gulp/package')
    );
    gutil.log(
      chalk.green('Using gulp from'),
      chalk.magenta(util.tildify('.', 'node_modules/gulp')),
      chalk.green('instead')
    );

    cliPackage = modulePackage;
  }
}

util.merge(env, {
           cwd : process.env.INIT_CWD,
    cliPackage : { version : cliPackage.version },
 modulePackage : { version : modulePackage.version }
});

runtime.config({
   env : env,
  argv : argv
});


gulp.doneCallback = function(){
  setTimeout(function(){
    runtime.prompt();
  }, 50);
};
