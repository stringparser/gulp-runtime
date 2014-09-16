'use strict';

var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var chalk = util.colors;

var modulePackage, cliPackage;
var argv = util.argv(process.argv);
var gulpfile = argv.gulpfile ? argv.gulpfile : path.resolve('.', 'gulpfile');

//
// ## Find if `gulp` was run from command line
//    and fetch the local and global versions
//    Note: will fetch global only if that was the case

var whichGulp = util.which.sync('gulp');
if( argv._.indexOf(whichGulp) > -1 ){

  cliPackage = require(
    path.resolve(
      whichGulp, '..', '..',
      'lib', 'node_modules', 'gulp', 'package'
    )
  );

}

try {

  modulePackage = require('gulp/package');

  try {
    gulpfile = require.resolve(gulpfile);
  } catch(err) {

    gulpfile = void 0;
    util.log(
      chalk.red('No gulpfile found in '),
      chalk.magenta(util.tildify('.', gulpfile))
    );
    runtime.emit('message', {
       error : err,
      propmt : true
    });
  }

} catch(err){

  util.log(chalk.red('gulp is not installed locally'));
  util.log('Try running: npm install gulp');
  process.exit(1);
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
