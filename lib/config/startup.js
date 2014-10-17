'use strict';

var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var chalk = util.colors;
var debug = util.debug(__filename);
var argv = util.argv(process.argv.slice(2));
//
// ## Find if `gulp` was run from command line
// Note: cliPackage will be fetch only if that was the case

var cliPackage;
var whichGulp = util.which.sync('gulp');

if( process.argv.indexOf(whichGulp) > -1 ){

  // it can be a symlink...
  cliPackage = {
    version : require( path.resolve(
      whichGulp, '..', '..', 'lib', 'node_modules', 'gulp', 'package.json'
    ) ).version
  };
}
cliPackage = cliPackage || null;


//
// ## local `gulp` module
//

var modulePackage;
try {

  modulePackage = {
    version : require('gulp/package').version
  };

} catch(err) {
  util.log(chalk.red('gulp is not installed locally'));
  util.log('Try running: npm install gulp');
  process.exit(1);
}

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
      chalk.magenta(util.tildify(argv.gulpfile))
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

//
// ## launch `gulp` locally
// cliPackage === null at this point
var gulpInst = require('gulp');
if( cliPackage === null ){
  runtime.emit('message',{
    stamp : true,
    message : 'Using gulpfile ' +
      chalk.magenta( util.tildify(argv.gulpfile) ) +
      ' with local gulp@'+modulePackage.version
  });
  // require de gulpfile
  require(argv.gulpfile);
  // wire up loggin since this is done from `gulp/bin`
  util.logEvents(gulpInst);
} else {
  process.nextTick(function(){
    gulpInst.removeAllListeners();
    util.logEvents(gulpInst);
  });
}

// Last but not least
//  - add tasks to completion
//  - wire up status messages
//  - setup the default prompt
runtime.setPrompt(' > ');
process.nextTick(function setup(){
  var tasks = Object.keys(gulpInst.tasks);
  runtime.set({ completion : tasks });
  if( cliPackage === null ){
    runtime.emit('line', argv._.join(' ') || 'default');
  }

  debug('[init completion]');
  debug('tasks', tasks);
  debug('completion', runtime.get().completion);

  var timer; runtime.config('wait', 10);
  runtime.on('status', function(){
    clearTimeout(timer);
    timer = setTimeout(
      runtime.prompt.bind(runtime), runtime.config('wait')
    );
  });
});