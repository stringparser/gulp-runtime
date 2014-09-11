

var runtime = require('../gulp-runtime');

runtime.set(['-v', '--version'], function version(){

  //
  // always lazy
  // though it makes no sense here
  // since gulp itself its requiring them
  //
  var semver = require('semver');
  var tildify = require('tildify');
  var gutil = require('gulp-util');

  var modulePackage = runtime.config('modulePackage');
  var cliPackage = runtime.config('cliPackage');

  if (semver.gt(cliPackage.version, modulePackage.version)) {

    gutil.log(chalk.red('Warning: gulp version mismatch:'));
    gutil.log(chalk.red('Global gulp is', cliPackage.version));
    gutil.log(chalk.red('Local gulp is', modulePackage.version));

  } else {
    gutil.log('CLI version', cliPackage.version);
    gutil.log('Local version', modulePackage.version);
  }

  runtime.prompt();
});
