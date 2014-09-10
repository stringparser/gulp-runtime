

var runtime = require('../gulp-runtime');
var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = gutil.colors;

runtime.set(['-v', '--version'], function version(){

  //
  // require modules on first use
  //
  // This makes no sense here since gulp itself
  // its requiring them from its `.bin`.
  //
  var semver = require('gulp/node_modules/semver');
  var tildify = require('gulp/node_modules/tildify');
  var cliPackage = require('/usr/lib/node_modules/gulp/package');

  var chalk = gutil.colors;
  var modulePackage;

  try {
    modulePackage = require('gulp/package');
  }
  catch(e){
    gutil.log(
      chalk.red('Local gulp not found in'),
      chalk.magenta(tildify(env.cwd))
    );
    gutil.log(chalk.red('Try running: npm install gulp'));
    process.exit(1);
  }

  if (semver.gt(cliPackage.version, modulePackage.version)) {
    gutil.log(chalk.red('Warning: gulp version mismatch:'));
    gutil.log(chalk.red('Global gulp is', cliPackage.version));
    gutil.log(chalk.red('Local gulp is', modulePackage.version));
  }
  else {
    gutil.log('CLI version', cliPackage.version);
    gutil.log('Local version', modulePackage.version);
  }
});
