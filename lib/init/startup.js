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

// find the gulpfile
argv.gulpfile = path.resolve('.', argv.gulpfile || 'gulpfile.js');
var basename = path.basename(argv.gulpfile);
var basedir = path.resolve('.', argv.cwd || path.dirname(argv.gulpfile));
var configFile = util.findup(basename, { cwd : basedir });
argv.gulpfile = configFile || argv.gulpfile;

//
// ## launch `gulp` locally
//
runtime.config('env', argv);
if( cliPackage.version === void 0 ){

  process.once('exit', function(code){
  if( code === 0 && runtime.config('failed') ){
      process.exit(1);
    }
  });

  if( configFile === null ){
    basedir = chalk.magenta(util.tildify(path.dirname(argv.gulpfile)));
    basename = '\'' + chalk.cyan(basename) + '\'';
    runtime.emit('message', {
      message :
        chalk.red('No gulpfile ') + basename +
        chalk.red(' found from ') + basedir,
      stamp : true,
      badge : true
    });
    return process.exit(1);
  }

  basedir = argv.cwd ? basedir : path.dirname(configFile);
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
var gulpInst = require('gulp');
//
// ## save and put defaults
//

runtime.config('env', {
  failed : false,
  which : whichGulp,
  gulpfile : argv.gulpfile,
  INIT_CWD : process.env.INIT_CWD,
  cliPackage : cliPackage,
  modulePackage : modulePackage
});

//
// Last but not least
//----------------------
//  - add tasks to completion
//  - status messages

var status = { done : [] };
// status is hooked to `gulp`'s logging
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
  }
});

process.nextTick(function setup(){
  var tasks = Object.keys(gulpInst.tasks);
  // add tasks to completion
  runtime.set({ completion : tasks });
  // prewarm history
  runtime.history = tasks.sort();
  // dispatch
  util.logEvents(gulpInst);
  if( cliPackage.version === void 0 ){
    process.argv = process.argv.join(' ')
      .replace(/--repl|--repl=\S+/, '')
      .trim().split(/[ ]+/);
    if( !argv._.length ){  process.argv.push('default');  }
    runtime.emit('next', process.argv.slice(2) );
  }
});
