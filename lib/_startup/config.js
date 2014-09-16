'use strict';

var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var modulePackage, cliPackage;
var argv = util.argv(process.argv.slice(2));
var gulpfile = argv.gulpfile ? argv.gulpfile : path.resolve('.', 'gulpfile');

//
// ## Find if `gulp` was run from command line
//    and fetch the local and global versions
//    Note: will fetch global only that was the case

var whichGulp = util.which.sync('gulp');
if( process.argv.indexOf(whichGulp) > -1 ){

  cliPackage = require(
    path.resolve(
      whichGulp, '..', '..',
      'lib', 'node_modules', 'gulp', 'package'
    )
  );

}

try {
  modulePackage = require('gulp/package');
} catch(err){

  var chalk = util.colors;
  util.log(chalk.red('gulp is not installed locally'));
  util.log('Try running: npm install gulp');
  process.exit(1);

  try {
    require.resolve(gulpfile);
  } catch(err) {

    util.log(
      chalk.red('No gulpfile found in '),
      chalk.magenta(util.tildify('.', gulpfile))
    );
    runtime.emit('message', {
       error : err,
      propmt : true
    });
  }
}

runtime.config({
  env : {
    which : whichGulp,
    cwd : process.env.INIT_CWD,
    gulpfile : gulpfile,
    cliPackage : {
      version : cliPackage ? cliPackage.version : null
    },
    modulePackage : {
      version : modulePackage.version
    }
  },
  argv : argv,
  failed : false
});
