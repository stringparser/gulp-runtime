'use strict';

var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var chalk = util.colors;
var env = util.whech.sync('gulp');
var argv = runtime.parser(process.argv.slice(2));

//
// ## let's check things
//

if( !env.globalPackage.version ){
  runtime.output = process.stdout;
  util.log(util.longBadge);
  util.log(chalk.red('gulp is not installed globally'));
  util.log('Try running: npm install gulp -g');
  return process.exit(1);
}

if( !env.localPackage.version ){
  runtime.output = process.stdout;
  util.log(util.longBadge);
  util.log(chalk.red('gulp is not installed locally'));
  util.log('But is globally at', chalk.magenta(
    util.tildify(env.globalDir) + 'gulp@' + env.globalPackage.version
  ));
  util.log('Try running: \'npm link gulp\' or \'npm install gulp\'');
  return process.exit(1);
}

if( env.configFile instanceof Error ){
  env.configFile = path.basename(env.configFile);
  runtime.output = process.stdout;
  util.log(util.longBadge);
  util.log(chalk.red('No gulpfile ') + '\'' + env.configFile + '\'');
  util.log(chalk.red(' found from ') + '\'' + env.cwd  + '\'');
  return process.exit(1);
}

runtime.config('env', util.merge(env, argv));

//
// ## wire up logging if wasn't run from bin
//

if( !env.runFromBin ){

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

  // load de gulpfile
  require(env.configFile);
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
  var tasks = Object.keys(gulp.tasks);
  runtime.set({  completion : tasks  });
  util.logEvents(gulp);
  if( !env.runFromBin ){
    var cmd = new RegExp(runtime.get().completion.join('|'), 'g');
    var argv = process.argv.slice(2).join(' ').match(cmd) || [ ];
    var hasTasks = (new RegExp(tasks.join('|'))).test(argv.join(' '));
    runtime.emit('next',  hasTasks ? argv : argv.concat('default')  );
  }
});
