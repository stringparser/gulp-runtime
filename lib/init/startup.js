'use strict';

var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var chalk = util.colors;
var env = util.whech.sync('gulp', '--gulpfile');
var argv = runtime.parser(process.argv.slice(2));

// save environment
env.gulpfile = env.configFile;
env.noColor = argv.logTask ? true : Boolean(env.color);
runtime.config('env', util.merge(env, argv));

//
// ## lauch gulp if wasn't run from bin
//
if( !env.runFromBin ){

  // is gulp installed?
  if( !env.globalPackage.version && !env.localPackage.version ){
    runtime.output = process.stdout;
    util.log(util.longBadge);
    util.log(chalk.red('gulp is neither installed globally nor locally'));
    util.log('Try running one of the following:');
    util.log(' npm install gulp');
    util.log(' npm install --global gulp');
    return process.exit(1);
  }

  var message;
  // change the cwd to that of the gulpfile
  if ( process.cwd() !== env.cwd ) {
    process.chdir(env.cwd);
    message = 'Working directory changed to ' +
      chalk.magenta(util.tildify(env.cwd)) + '\n' +
      'Using gulpfile ' + chalk.magenta(env.configFile);
  }

  message = message || 'Using gulpfile ' +
    chalk.magenta(util.tildify(env.configFile)) +
    (env.localPackage.version ? ' locally': ' globally') +
    ' with gulp@' + (env.localPackage.version || env.globalPackage.version);

  if( !argv.logTask ){
    runtime.emit('message', {
      message : message || '',
        stamp : true,
        badge : true
    });
  } else {  runtime.setPrompt('');  }

  // env.configFile comes from process.argv in this case
  // and only if was at process.argv[1] node will load the file for us :)
  // it can happen that we added the file manually, like when testing
  if( !require.cache[env.configFile] ){
    runtime.require(env.configFile);
  }
}

//
// ## finally
//  - add bached logging
//  - add tasks to completion
//  - dispatch argv as commands
//
var gulp = require('gulp');
process.nextTick(function setup(){
  // batched logging
  util.logEvents(gulp);

  // add tasks to completion
  var tasks = Object.keys(gulp.tasks);
  runtime.set({completion : tasks});

  if( !env.runFromBin ){
    // see if we can proceed
    if( !gulp.tasks.default ){
      runtime.output = process.stdout;
      util.log(util.longBadge);
      util.log(chalk.red('Task \'default\' is not in your gulpfile'));
      util.log('Please check the documentation for proper gulpfile formatting');
      return process.exit(1);
    }

    argv = process.argv.join(' ').match(util.cmdRE()) || [ ];
    var hasTasks = util.tasksRE(gulp).test(argv.join(' '));
    // dispatch
    runtime.emit('next',  hasTasks ? argv : argv.concat('default')  );
  }
});
