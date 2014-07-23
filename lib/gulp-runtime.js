'use strict';

// Module dependencies
var gutil = require('gulp-util')
  , initCli = require('./initCli');

// Expose `runtime`
module.exports = runtime;

function runtime(gulp){

  var data = {};
  var cmd = {};

  var runtime = {
    nextTick : function NextTick(){

    runtime.instance = gulp;
    // There is a problem with this on first run.
    // That is: when gulp is required and used
    // to set a new task on separate files it may happen that
    // the prompt is printed on the middle of the gulp log itself.
    //
    // the solution right now is hack : there should be a better way
    // i.e. using a setInterval for example and checking number of tasks
<<<<<<< HEAD
      setTimeout(function(){
        runtime.cli.prompt();
      }, 500)
=======
      runtime.instance = gulp;
      runtime.cli.prompt();
>>>>>>> ff096bf6ee319e3a4f7c610263e66412f1f66cc5
    },
    set : function setRuntimeVar(key, value){
      if(!key && !value)
        throw new gutil.PluginError({
          plugin : 'gulp-runtime',
          message : 'Provide a key and value'
        });
      else
        data[key] = value;
    },
    get : function getRuntimeVar(key){
      return data[key];
    },
    setCMD : function setRuntimeCMD(key, cb){
      if(typeof cb !== 'function')
        throw new gutil.PluginError({
          plugin : 'gulp-runtime',
          message : 'To set a command give a callback a second parameter.'
        });
      else if(key)
        cmd[(key).toString()] = cb;
      else
        throw new gutil.PluginError({
          plugin : 'gulp-runtime',
          message : 'To set a command give a key to identify it.'
        });
    },
    getCMD : function getRuntimeCMD(key){
      if(cmd[key])
        return cmd[key];
      else
        return cmd;
    }
  }

  runtime.cli = initCli.call(runtime);

  gulp.doneCallback = runtime.nextTick;

  return runtime;
}