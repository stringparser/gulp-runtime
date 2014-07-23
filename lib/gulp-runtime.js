'use strict';

// Module dependencies
var fs = require('fs')
  , path = require('path')
  , gutil = require('gulp-util')
  , initCli = require('./initCli');

// Expose `runtime`
module.exports = function runtime(gulp){

  var cmd = {};

  var runtime = {
    set : function setRuntimeCMD(key, cb){
      if(typeof cb !== 'function')
        throw new gutil.PluginError({
          plugin : 'gulp-runtime',
          message : 'Give a callback as a second parameter.'
        });
      else if(key)
        cmd[(key).toString()] = cb;
      else
        throw new gutil.PluginError({
          plugin : 'gulp-runtime',
          message : 'To set a command give a key to identify it.'
        });
    },
    get : function getRuntimeCMD(key){
      if(cmd[key])
        return cmd[key];
      else
        return cmd;
    },
    nextTick : function NextTick(){
      // There is a problem with this on first run.
      // That is: when gulp is required and used
      // to set a new task on separate files it may happen that
      // the prompt is printed on the middle of the gulp log itself.
      //
      // The solution right now is hack : there should be a better way
      // i.e. using a setInterval for example and checking number of tasks

      setTimeout(function(){
        runtime.instance = gulp;
        runtime.cli.prompt();
      }, 1000)
    },
    taskdir : function(pathname){

      var dir;
      try {
        dir = fs.readdirSync(pathname);
      }
      catch(e){
        var cyan =gulp.colors.cyan;
        throw new gutil.PluginError({
          plugin : 'gulp-runtime'
        });
      }

      var tasks = dir.filter(function(file){
        return /\.(js|coffee)$/i.test(
          path.extname(file)
        );
      });

      var len = tasks.length;
      tasks.forEach(function(task, index){

        // require all the tasks
        require( path.resolve(pathname, task) )

        if(index === len-1)
          runtime.instance = gulp;
      })
    }
  }

  runtime.cli = initCli.call(runtime);

  gulp.doneCallback = runtime.nextTick;

  return runtime;
}