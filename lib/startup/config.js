'use strict';

var fs = require('fs');
var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var argv = util.argv(process.argv.slice(2));
var modulePackage, cliPackage;
var whichGulp = util.which.sync('gulp');

var chalk = util.colors;

//
// ## Find if `gulp` was run from command line
//    and fetch the local and global versions
//
//    Note: will fetch global only if that was the case

if( process.argv.indexOf(whichGulp) > -1 ){

  cliPackage = path.resolve(
    whichGulp, '..', '..',
    'lib', 'node_modules', 'gulp', 'package'
  );

  if( fs.existsSync(cliPackage) ){
    cliPackage = require(cliPackage);
  }
} else {
  cliPackage = null;
}

//
// ## fetch the local version
//

modulePackage = './node_modules/gulp/package.json';

if( !fs.existsSync(modulePackage) ){

  util.log(chalk.red('gulp is not installed locally'));
  util.log('Try running: npm install gulp');
  process.exit(1);

}
modulePackage = {
  version : require('gulp/package').version
};

//
// ## gulpfile
//

argv.gulpfile = argv.gulpfile || path.resolve('.', 'gulpfile');

try {
  argv.gulpfile = require.resolve(argv.gulpfile);
} catch(err) {

  runtime.emit('message', {
    throw : true,
    error : new Error(
      chalk.red('No gulpfile found in ') +
      util.tildify('.', argv.gulpfile)
    )
  });

  return ;
}

//
// ## save and put defaults
//

runtime.config({
  env : {
    failed : false,
    which : whichGulp,
    gulpfile : argv.gulpfile,
    INIT_CWD : process.cwd(),
    cliPackage : cliPackage,
    modulePackage : modulePackage
  }
});

process.once('exit', function(code){
  if( code === 0 && runtime.config('failed') ){
    process.exit(1);
  }
});

var gulpInst = require('gulp');

gulpInst.doneCallback = function(){
  setTimeout(function(){
    runtime.prompt();
  }, 50);
};

//
// ## launch `gulp` locally
// That is: no cliPackage found

if( cliPackage === null ){

  // wire up loggin since this is done from `gulp/bin`
  util.logEvents(gulpInst);

  runtime.emit('message',{
    stamp : true,
    message : 'Using local gulp with `gulpfile` '+
    chalk.magenta( util.tildify('.', argv.gulpfile) )
  });

  require(argv.gulpfile);
  runtime.emit('refresh', argv);
}
