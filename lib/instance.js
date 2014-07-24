'use strict';

// module dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var color = gutil.colors;
var ansiJS = require('ansi-highlight')

//
var plugin_name = 'gulp-runtime';
var plugin_badge = {
  plain : plugin_name,
  color : color.cyan(plugin_name)
};

// instance
module.exports = function runtimeInstance(runtime, scope){

  runtime.on('command', function(args, scope){

    // initialize the runtime scope
    // with gulp: scope === gulp
    scope = scope || runtime;

    if(!(scope instanceof gulp.__proto__.Gulp))
      throw new gutil.PluginError({
         plugin : plugin_name,
        message : 'You need to pass a instace of gulp to the plugin.'
      });

    // debugging
    console.log(arguments)
    var commands = runtime.get();
    if(commands){
      console.log('instance.js\n Runtime commands are:');
      commands.forEach(function(cmd){
        var code = runtime.get(cmd);
            code = typeof code === 'function' ?
              ''+code : JSON.stringify(code);

        console.log('  %s : %s', cmd,
          code ? ansiJS(code) : 'undefined'
        )
      });
    }

    var cmd = args.cmd[0];
    var arg = {
        raw : args.raw,
        cmd : args.cmd.slice(1),
      param : args.param
    };

    console.log('scope[%s] = ', cmd, scope[cmd]);
    console.log('runtime.get(%s) = ', cmd, runtime.get(cmd));

    if(scope[cmd])
      runtime.emit('task', cmd, arg, scope);
    else if(runtime.get(cmd))
      runtime.emit('cmd' , cmd, arg, scope);
    else
      RuntimeWarning(runtime, function(){
        return 'No task or command defined for '+cmd + '\n';
      });

  }).on('task', function(name, args, scope){

    gulp.start(name);
    runtime.emit('finish');

  }).on('cmd', function(cmd, args, scope){

    var cb = runtime.get(cmd);
    if(typeof cb === 'function')
      cb(args, scope);
    else
      RuntimeWarning(runtime, function(){
        return (' No callback(s) registered for:\n'
          + color.green('  command(s): ') + JSON.stringify(args.cmd) + '\n'
          + color.green('parameter(s): ') + JSON.stringify(args.param) + '\n'
        );
      });

    runtime.emit('finish');

  }).on('finish', function(){
    console.log()
    runtime.prompt();
  })


}

function RuntimeWarning(runtime, cb){

  var message = (
    plugin_name.color   + '\n' +
    '------------------'+ '\n' +
    color.red(' Error') + '\n' +
    cb()
  );

  message.split('\n').forEach(
    function(line){
      gutil.log(line)
    }
  );
  runtime.emit('finish');
}