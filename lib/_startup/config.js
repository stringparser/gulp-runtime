'use strict';

var path = require('path');
var gutil = require('gulp-util');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var chalk = gutil.colors;
var modulePackage, cliPackage;

var argv = util.args(process.argv.slice(2));
var gulpfile = argv.gulpfile ? argv.gulpfile : path.resolve('.', 'gulpfile');

//
// ## Find if `gulp` was run from command line
//

var fromCL = process.argv.filter(function(arg){
  return arg.match(/gulp$/);
}).length > 0;

if( fromCL ){

  runtime.config({ fromCL : true });
  cliPackage = require('/usr/lib/node_modules/gulp/package');
}

try {
  modulePackage = require('gulp/package');
} catch(err){

  gutil.log(
    chalk.red('gulp is not installed locally'),
    chalk.magenta(
      util.tildify('.', 'node_modules/gulp')
    )
  );
  gutil.log(
    chalk.red('Try running: npm install gulp')
  );
  process.exit(1);
}

try {

  require.resolve(gulpfile);

} catch(err) {

  gutil.log(
    chalk.red('No gulpfile found in '),
    chalk.magenta(util.tildify('.', gulpfile))
  );
  runtime.emit('message', {
     error : err,
    propmt : true
  });
}

runtime.config({
  env : {
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
