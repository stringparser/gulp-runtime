'use strict';

var fs = require('fs');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var debug = require('debug')('gr:refresh');

// copy `env` before anyone can touch it
var env = util.merge({ }, runtime.config('env') );

//
// ## refresh: run gulp tasks queued
//
// The current approach is quite naive
// this this should be thought to run
// more than once.
//
runtime.on('refresh', function(argv){

  var gulp = require('gulp');
  var chalk = util.colors;
  var gulpfile = argv.gulpfile || env.gulpfile;

  if( !runtime.config('status') ){
    return ;
  }

  runtime.emit('message', {
    message : 'reloading '+chalk.magenta(util.tildify(gulpfile))
  });

  fs.readFile(gulpfile,  { encoding : 'utf8' }, function(err, data){

    if(err){
      runtime.emit('message', {
        error : err
      });
    }

    require(gulpfile);    
    var toRun = '';
    data.replace(/task\(((\'|\")\S+(\'|\"))\,/g, function($0,$1){

      var task = $1.substring(1, $1.length - 1);

      debug('task', task);
      if( gulp.tasks[task] && task !== 'default' ){
        toRun += ' '+task;
      }
    });

    debug('toRun', toRun);
    runtime.emit('wire', toRun);

  });
});
