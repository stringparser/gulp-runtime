
// module dependencies
var gutil = require('gulp-util');
var color = gutil.colors;
var childGulp = require('../util/childGulp');
var printTask = require('../util/printTask');

// instance
module.exports = function runtimeInstance(runtime, scope){

  runtime.on('command', function(cmd, scope){

    console.log('runtime commands',runtime.get())

    scope = scope || runtime;
    var cb = runtime.get(cmd);

    if(typeof cb === 'function')
        cb(cmd, scope);
    else {
      PluginError({
        plugin : 'gulp-runtime',
        message : 'No callback for "'+color.cyan(cmd)+'" command\n'
      });

      runtime.prompt();
    }
  }).on('--param', function(args, scope){

    console.log(arguments)
  })
}

function PluginError(obj){

  gutil.log(color.cyan(obj.plugin))
  gutil.log(obj.message)
}