'use strict';

var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

// INIT_CWD
process.env.INIT_CWD = process.env.INIT_CWD || process.cwd();

//
var chalk = util.colors;
var argv = util.argv(process.argv.slice(2));

//
// ## Find if `gulp` was run from command line
// Note: cliPackage will be fetch only if that was the case

var cliPackage = { };
var whichGulp = util.which.sync('gulp');
if( process.argv.indexOf(whichGulp) > -1 ){
  // it can be a symlink...
  var globalLib = path.resolve(whichGulp, '..', '..', 'lib');
  cliPackage.version = require(
    path.join(globalLib, 'node_modules', 'gulp', 'package.json')
  ).version;
}
cliPackage = cliPackage || null;

//
// ## local `gulp` module
//

var modulePackage = { };
try {
  modulePackage.version = require('gulp/package').version;
} catch(err) {
  util.log(chalk.red('gulp is not installed locally'));
  util.log('Try running: npm install gulp');
  process.exit(1);
}

//
// ## launch `gulp` locally
//
var gulpInst = require('gulp');
if( cliPackage.version === void 0 ){

  process.once('exit', function(code){
  if( code === 0 && runtime.config('failed') ){
      process.exit(1);
    }
  });

  // find the gulpfile
  argv.gulpfile = path.resolve('.', argv.gulpfile || 'gulpfile.js');
  var basename = path.basename(argv.gulpfile);
  var basedir = path.resolve('.', argv.cwd || path.dirname(argv.gulpfile));

  var found = util.findup(basename, { cwd : basedir });
  argv.gulpfile = found || argv.gulpfile;

  if( found === null ){
    argv.gulpfile = path.dirname(argv.gulpfile);
    runtime.emit('message', {
      message :
        chalk.red('No gulpfile found from ') +
        chalk.magenta(util.tildify(argv.gulpfile)),
      stamp : true,
      badge : true
    });
    return process.exit(1);
  }

  basedir = argv.cwd ? basedir : path.dirname(found);
  var cwdChanged = process.cwd() !== basedir;
  if ( cwdChanged ) {
    process.chdir(basedir);
    runtime.emit('message', {
     message : 'Working directory changed to ' +
      chalk.magenta(util.tildify(basedir)),
     stamp : true,
     badge : true
    });
  }

  runtime.emit('message', {
    message : 'Using gulpfile ' +
      chalk.magenta( util.tildify(argv.gulpfile) ) +
      ' locally with gulp@'+modulePackage.version,
    stamp : true,
    badge : cwdChanged ? false : true
  });

  // require de gulpfile
  require(argv.gulpfile);
}

//
// ## save and put defaults
//

runtime.config({
  env : {
    failed : false,
    which : whichGulp,
    gulpfile : argv.gulpfile,
    INIT_CWD : process.env.INIT_CWD,
    cliPackage : cliPackage,
    modulePackage : modulePackage
  }
});
//
// Last but not least
//----------------------
//  - wire up loggin and status messages
//  - add tasks to completion

// logging
gulpInst.removeAllListeners();
util.logEvents(gulpInst);

// status is hooked to `gulp`'s logging
var status = { done : [] };
runtime.on('st', function statusDone(e){
  status[e.task] = e;
  if( e.duration ){
    var index = status.done.push(e.task);
    if( gulpInst.seq[index] ){
      return runtime.emit('status', status);
    }
    status.allDone = true;
    runtime.emit('status done', status);
    status = { done : [ ] };
    setTimeout(function(){
      runtime.prompt();
    }, 10);
  }
});

process.nextTick(function setup(){
  var tasks = Object.keys(gulpInst.tasks);
  // write to the runtime input
  if( cliPackage.version === void 0 ){
    var toRun = argv._.join(' ') || 'default';
    runtime.emit('next', toRun);
  }
  // add tasks to completion
  runtime.set({ completion : tasks });
  // prewarm history
  runtime.history = tasks.sort();
});
