'use strict';

var gulpInst = require('gulp');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');
var logEvents = require('../utils/logEvents');
//
// ## run locally if gulp is not installed globally
//

if( !runtime.config('fromCL') ){

  var gutil = require('gulp-util');
  var chalk = gutil.colors;

  var gulpfile = runtime.config('env').gulpfile;
  process.once('exit', function(code){
    if( code === 0 && runtime('failed') ){
      process.exit(1);
    }
  });

  gutil.log(
    'Working locally with gulpfile',
    chalk.magenta(
      util.tildify('.', gulpfile)
    )
  );
  require(gulpfile);
  logEvents(gulpInst);

  var toRun = runtime('argv')._;
  process.nextTick(function(){
    gulpInst.start.apply(gulpInst, toRun[0] ? toRun : ['default'] );
  });
}

gulpInst.doneCallback = function(){
  setTimeout(function(){
    runtime.prompt();
  }, 50);
};
