
// module dependencies
var spawn = require('child_process').spawn;

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

    child.kill();

    // provide callback
    if( typeof cb === 'function')
      cb(child)
  })
}