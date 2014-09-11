/*
 *
 */
var minimist = require('minimist');

var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = gutil.colors;

var modulePackage,
    cliPackage = require('/usr/lib/node_modules/gulp/package');

try {
  modulePackage = require('gulp/package');
} catch(e){

  gutil.log(
    chalk.red('Local gulp not found in'),
    chalk.magenta(tildify(env.cwd))
  );

  gutil.log(chalk.red('Try running: npm install gulp'));
  process.exit(1);
}

var runtime = require('../gulp-runtime');

runtime({
            env : process.env,
     cliPackage : cliPackage,
  modulePackage : modulePackage
});

gulp.doneCallback = function(){

  setTimeout(function(){
    runtime.prompt();
  }, 200);
};
