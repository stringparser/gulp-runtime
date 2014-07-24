'use strict';

// module dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var color = gutil.colors;
var ansiJS = require('ansi-highlight');
var childGulp = require('../util/childGulp');

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

    var cmd = args.cmd[0];
    var arg = {
        raw : args.raw,
        cmd : args.cmd.slice(1),
      param : args.param
    };

    if(runtime.get(cmd))
      runtime.emit('cmd' , cmd, arg, scope);
    else if(runtime.scope[cmd])
      runtime.emit('scope', cmd, arg, scope);
    else
      RuntimeWarning(runtime, function(){
        return 'No command defined as "'+cmd + '"\n';
      });

  }).on('--param', function(args, scope){

    var argv = args.raw.match(/(-|--)\w+/g);
    childGulp(argv, function(child){
      child.kill();
      runtime.emit('done');
    })

  }).on('cmd', function(cmd, args, scope){

    var cb = runtime.get(cmd)
      , warn;

    if(typeof cb === 'function')
      RuntimeWarning(runtime, function(){
        return cb(args, scope);
      })
    else
      throw RuntimeWarning(runtime, function(){
        return (' No callback(s) registered for:\n'
          + color.green('  command(s): ') + JSON.stringify(args.cmd) + '\n'
          + color.green('parameter(s): ') + JSON.stringify(args.param) + '\n'
        );
      });

    runtime.emit('done');

  }).on('scope', function(cmd, args, scope){

    // gulp.start(cmd)
    scope.start(cmd);

  }).on('done', function(){

    runtime.prompt();
  })


}

function RuntimeWarning(runtime, cb){

  var warn = cb();

  if(warn){
    var message = (
      plugin_badge.color   + '\n' +
      '------------------' + '\n' +
      color.red('Error: ')   + '\n'
    );

    console.log(
      padStr(message, 4).concat(
        padStr(warn, 5)
      )
    )
  }

  runtime.emit('done');
}

function padStr(str, num){

  var ret = '';
  var pad = new Array(
    num ? num : 0 + 1
  ).join(' ');

  var par = str.split('\n');
  var len = par.length;

  par.forEach(
    function(line, index){
      ret += pad + line;
      ret += (index !== len-1) ? '\n' : '';
    }
  );

  return ret;
}

// on('command') debugging
/* console.log('scope[%s] = ', cmd, scope[cmd]);
    console.log('runtime.get(%s) = ', cmd, runtime.get(cmd));
*/
/*console.log(arguments)
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
}*/