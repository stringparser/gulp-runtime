'use strict';

var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

//
// ## save `env` before anyone can touch it
//
var env = runtime.config('env');

runtime.set(['-v', '--version'], function version(){

  //
  // always lazy
  // though it makes no sense here
  // since gulp itself its requiring them
  //
  var semver = require('semver');
  var chalk = util.colors;

  var cliPackage = env.cliPackage;
  var modulePackage = env.modulePackage;

  if( env.cliPackage === null ){

    util.log('Working locally. Local gulp is ', modulePackage.version );

  } else if ( semver.gt(cliPackage.version, modulePackage.version) ) {

    util.log(chalk.red('Warning: gulp version mismatch:'));
    util.log(chalk.red('Global gulp is', cliPackage.version));
    util.log(chalk.red('Local gulp is', modulePackage.version));

  } else {
    util.log('CLI version', cliPackage.version);
    util.log('Local version', modulePackage.version);
  }

  runtime.prompt();
});
