
// module dependencies
var spawn = require('child_process').spawn
  , PluginError = require('gulp-util').PluginError;

// helpers
var stdout = process.stdout;

module.exports = function childGulp(argv, cb){

  // maintain default '--color'
  if(argv[0] !== '--color' && argv[0] !== '--no-color')
    argv.unshift('--color');

  var child = spawn('gulp', argv);

  // don't keep parent process waiting
  child.stdin.end();
  // Handle output
  child.stdout.on('data', function(chunk){
    stdout.write(chunk);
  }).on('end', function(){

    // provide callback
    if( typeof cb === 'function')
      cb(child);
    else if(typeof cb !== 'undefined')
      throw new PluginError({
        plugin : 'gulp-runtime',
        message : 'childGulp needs a callback\n Report this error'
      })

  })
}