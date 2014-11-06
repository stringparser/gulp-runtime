'use strict';

var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var chalk = util.colors;
var env = util.whech.sync('gulp');
var argv = runtime.parser(process.argv.slice(2));

runtime.config('env', util.merge(env, argv));

//
// ## lauch gulp locally
//    if not run from bin

if( !env.runFromBin ){

  //
  // ## let's check things
  //

  if( !env.localPackage.version && !env.globalPackage.version ){
    runtime.output = process.stdout;
    util.log(util.longBadge);
    util.log(chalk.red('gulp is not installed globally or locally'));
    util.log('Try running: npm install gulp -g');
    return process.exit(1);
  }

  if( !env.localPackage.version && env.globalPackage.version ){
    runtime.output = process.stdout;
    util.log(util.longBadge);
    util.log(chalk.red('gulp is not installed locally'));
    util.log('But is globally at', chalk.magenta(
      util.tildify(env.globalDir) + 'gulp@' + env.globalPackage.version
    ));
    util.log('Try running: \'npm link gulp\' or \'npm install gulp\'');
    return process.exit(1);
  }

  var message = '';
  if ( process.cwd() !== env.cwd ) {
    process.chdir(env.cwd);
    message = 'Working directory changed to ' +
      chalk.magenta(util.tildify(env.cwd)) + '\n' +
      'Using gulpfile ' + chalk.magenta(path.basename(env.configFile));
  }

  message = message || 'Using gulpfile ' +
    chalk.magenta(util.tildify(env.configFile)) +
    (env.localPackage.version ? ' locally': ' globally');

  var version = env.localPackage.version
  || env.globalPackage.version;
  runtime.emit('message', {
    message : message + ' with gulp@' + version,
    stamp : true,  badge : true
  });

  // there is no need to run the file
  // since node already loads it!
  // require(env.configFile);
}

//
// ## save environment
//

runtime.config('env', { gulpfile : env.configFile });

//
// ## either way
//    (gulp runned from bin or node gulpfile)
//  - add bached logging
//  - add tasks to completion
//  - dispatch argv as commands
//
var gulp = require('gulp');
process.nextTick(function setup(){
  // stop if there is no default task
  if( !env.runFromBin && !gulp.tasks.default ){
    runtime.output = process.stdout;
    util.log(util.longBadge);
    util.log(chalk.red('Task \'default\' is not in your gulpfile'));
    util.log('Please check the documentation for proper gulpfile formatting');
    return process.exit(1);
  }

  // batched logging
  util.logEvents(gulp);
  var tasks = Object.keys(gulp.tasks);
  runtime.set({  completion : tasks  });
  if( !env.runFromBin ){
    var cmd = new RegExp(runtime.get().completion.join('|'), 'g');
    var argv = process.argv.slice(2).join(' ').match(cmd) || [ ];
    var hasTasks = (new RegExp(tasks.join('|'))).test(argv.join(' '));
    runtime.emit('next',  hasTasks ? argv : argv.concat('default')  );
  }
});
