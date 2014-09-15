'use strict';

var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = gutil.colors;

var util = require('runtime/lib/utils');
var runtime = require('../gulp-runtime');
var argv = util.args(process.argv.slice(2));

var modulePackage, cliPackage, env = { };

try {

  modulePackage = require('gulp/package');
  cliPackage = require('/usr/lib/node_modules/gulp/package');

  try {

    if(argv.gulpfile){
      env.gulpfile = argv.gulpfile;
    } else {
      env.gulpfile = require.resolve(
        path.resolve('.', 'gulpfile')
      );
    }

  } catch(err){

    env.gulpfile = path.resolve('.', 'gulpfile');

    gutil.log(
      chalk.red('No gulpfile found in '),
      chalk.magenta(util.tildify(env.gulpfile))
    );
    gutil.log(
      err
    );
  }

} catch(err){

  if(!modulePackage){
    gutil.log(
      chalk.red('Local gulp not found in'),
      chalk.magenta(util.tildify('gulp'))
    );
    gutil.log(chalk.red('Try running: npm install gulp'));
    process.exit(1);
  }

  if(!cliPackage){
    gutil.log(
      chalk.red('No global gulp found in'),
      chalk.magenta('/usr/lib/node_modules/gulp/package')
    );
    gutil.log(
      chalk.green('Using gulp from'),
      chalk.magenta(util.tildify('.', 'node_modules/gulp')),
      chalk.green('instead')
    );

    cliPackage = modulePackage;
  }
}

util.merge(env, {
           cwd : process.env.INIT_CWD,
    cliPackage : { version : cliPackage.version },
 modulePackage : { version : modulePackage.version }
});

runtime.config({
   env : env,
  argv : argv
});

//
// ## something could not be found
//
runtime.on('message', function(opts){

  if( !opts.error ){

    opts.message = (opts.message || '').replace(/(`|'|")(\S+)(`|'|")/g,
      function($0,$1,$2,$3){
        return $1 + chalk.cyan($2) + $3;
      }
    );

    if( opts.message && opts.message.trim() !== '' ){
      console.log(
        ' ['+chalk.yellow('gulp-runtime') + '] ' +
        opts.message
      );
    }

  } else {

    var err = opts.error;

    util.Error.call(err, err.message, function(error){

      error.message = new gutil.PluginError({
           plugin : 'gulp-runtime',
          message : err.message
      });

    });

    if( opts.throw ){
      throw err;
    }

    var logIsSilent = (gutil.log).toString();
        logIsSilent = logIsSilent.match(/{(.*)}/)[1].trim() === '';

    if(err.stack){

      err.stack.split('\n').forEach(function(line){
        if( logIsSilent ){
          console.log(line);
        } else {
          gutil.log(line);
        }
      });
    }

  }

  if( !opts.throw && opts.prompt ){
    runtime.prompt();
  }
});


gulp.doneCallback = function(){
  setTimeout(function(){
    runtime.prompt();
  }, 50);
};
