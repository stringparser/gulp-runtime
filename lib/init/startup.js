'use strict';

var path = require('path');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var env = util.whech.sync('gulp');

if( !env.which && env.modulePackage instanceof Error ){
  util.log(chalk.red('gulp is not installed locally or globally'));
  util.log('Try running: npm install gulp');
  process.exit(1);
}

var chalk = util.colors;
var basename = path.basename(env.configFile);
var basedir = path.dirname(env.configFile) || process.cwd();

env = util.merge(env, util.argv(process.argv.slice(2)));
runtime.config('env', env);

//
// ## launch logging if wasn't run from bin
//
if( !env.runFromBin ){
  if( env.configFile instanceof Error ){
    runtime.emit('message', {
      message :
        chalk.red('No gulpfile ') + '\'' + basename + '\'' +
        chalk.red(' found from ') + '\'' + basedir  + '\'',
      stamp : true,
      badge : true
    });
    return process.exit(1);
  }

  var message = '';
  if ( process.cwd() !== basedir ) {
    process.chdir(basedir);
    message = 'Working directory changed to ' +
      chalk.magenta(util.tildify(basedir)) + '\n' +
      'Using gulpfile ' + chalk.magenta(basename);
  }
  message =  message || 'Using gulpfile ' +
    chalk.magenta(util.tildify(env.configFile));

  var version = env.cliPackage.version;
  if( !version ){
    message += ' locally ';
    version = env.modulePackage.version;
  } else { message += ' globally '; }

  runtime.emit('message', {
    message : message + 'with gulp@' + version,
    stamp : true,  badge : true
  });

  // require de gulpfile
  require(env.configFile);
}

//
// ## last but not least
//  - add tasks to completion
//  - prewarm history
//  - dispatch

var gulpInst = require('gulp');
process.nextTick(function setup(){
  var tasks = Object.keys(gulpInst.tasks);

  runtime.set({ completion : tasks });
  runtime.history = runtime.get().completion;

  if( !env.runFromBin ){
    util.logEvents(gulpInst);
    var argv = process.argv.slice(2).join(' ')
      .replace(/--repl|--repl=\S+/, '').trim();

    if( !argv.length ){  argv = 'default';  }
    runtime.emit('next', argv);
  }
});
