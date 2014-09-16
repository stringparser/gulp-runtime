'use strict';

var gulpInst = require('gulp');
var util = require('runtime/lib/utils');
var runtime = require('runtime').get('gulp');

var env = runtime.config('env');
var argv = util.argv(process.argv);

//
// ## run locally if gulp is not installed globally
//

if( argv._.indexOf(env.which) < 0 ){

  var chalk = util.colors;

  process.once('exit', function(code){
    if( code === 0 && runtime.config('failed') ){
      process.exit(1);
    }
  });

  if( !env.gulpfile ){
    return ;
  }

  util.log(
    'Working locally with gulpfile',
    chalk.magenta(
      util.tildify('.', env.gulpfile)
    )
  );

  require(env.gulpfile);
  if( !argv.silent ){
    util.logEvents(gulpInst);
  }

  var toRun = runtime.config('argv')._;
  process.nextTick(function(){
    gulpInst.start.apply(gulpInst, toRun[0] ? toRun : ['default'] );
  });
}

gulpInst.doneCallback = function(){
  setTimeout(function(){
    runtime.prompt();
  }, 50);
};
