'use strict';

var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var chalk = util.colors;
var env = runtime.config('env');

//
// ## launch logging if wasn't run from bin
//

var gulp;
var globalModule, localModule;
if( env.localPackage.version ){
  gulp = require('gulp');
} else {
  globalModule = path.join(env.globalDir, 'gulp');
  localModule = path.join(env.cwd, 'node_modules', 'gulp');
  gulp = require(globalModule);
  // fake it
  require.cache[localModule] = require.cache[globalModule];
}

if( !env.runFromBin ){

  if( env.configFile instanceof Error ){
    env.configFile = path.basename(env.configFile);
    runtime.emit('message', {
      message :
        chalk.red('No gulpfile ') + '\'' + env.configFile + '\'' +
        chalk.red(' found from ') + '\'' + env.cwd  + '\'',
      stamp : true,
      badge : true
    });
    return process.exit(1);
  }

  var message = '';
  if ( process.cwd() !== env.cwd ) {
    process.chdir(env.cwd);
    message = 'Working directory changed to ' +
      chalk.magenta(util.tildify(env.cwd)) + '\n' +
      'Using gulpfile ' + chalk.magenta(path.basename(env.configFile));
  }

  message =  message || 'Using gulpfile ' +
    chalk.magenta(util.tildify(env.configFile)) +
    (env.localPackage.version ? ' locally': ' globally');

  runtime.emit('message', {
    message : message + ' with gulp@' +
      env.localPackage.version
      || env.globalPackage.version,
    stamp : true,
    badge : true
  });

  // require de gulpfile
  require(env.configFile);
}
runtime.config('env', { gulpfile : env.configFile });

//
// ## either way
//    (gulp runned from bin or node gulpfile)
//    add tasks to completion
//    dispatch startup commands
//
process.nextTick(function setup(){
  var tasks = Object.keys(gulp.tasks);
  runtime.set({  completion : tasks  });

  if( !env.runFromBin ){
    util.logEvents(gulp);
    var cmd = new RegExp(runtime.get().completion.join('|'), 'g');
    var argv = process.argv.slice(2)
          .join(' ').match(cmd) || [ ];

    var hasTasks = (new RegExp(tasks.join('|')))
      .test(argv.join(' '));

    runtime.emit('next',
      hasTasks ? argv : argv.concat('default')
    );
  }
});
