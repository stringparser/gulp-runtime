'use strict';

var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var chalk = util.colors;
var env = util.whech.sync('gulp');

if( env.cliPackage.version || env.modulePackage.version ){ }
else {
  util.log(chalk.red('gulp is not installed locally or globally'));
  util.log('Try running: npm install gulp');
  process.exit(1);
}
runtime.config('env',
  util.merge(env,
    util.argv(process.argv.slice(2))
  )
);

//
// ## launch logging if wasn't run from bin
//
var gulp = require('gulp');
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
    (env.modulePackage.version ? ' locally': ' globally');

  runtime.emit('message', {
    message : message + ' with gulp@' +
      env.modulePackage.version
      || env.cliPackage.version,
    stamp : true,
    badge : true
  });

  // require de gulpfile
  require(env.configFile);
}
runtime.config('env', { gulpfile : env.configFile });

//
// ## either way (gulp runned or gulpfile)
//    add tasks to completion
//
process.nextTick(function setup(){
  var tasks = Object.keys(gulp.tasks);
  runtime.set({  completion : tasks  });



  if( !env.runFromBin ){
    util.logEvents(gulp);
    var argv = new RegExp(runtime.get().completion.join('|'), 'g');
        argv = process.argv.slice(2)
          .join(' ').match(argv) || [ ];

    var hasTasks = (new RegExp(tasks.join('|')))
      .test(argv.join(' '));

    runtime.emit('next',
      hasTasks
        ? argv
        : argv.concat('default')
    );
  }
});
