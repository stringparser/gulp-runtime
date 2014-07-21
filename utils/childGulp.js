
// module dependencies
var spawn = require('child_process').spawn
  , promptText = require('./prompt').promptText;

// helpers
var stdout = process.stdout;

module.exports = function childGulp(argv, cb){

  // maintain default '--color'
  if(argv[0] !== '--color' && argv[0] !== '--no-color')
    argv.unshift('--color');

  /*stdout.write('\n Child gulp started '+ JSON.stringify(argv) + '\n\n');*/
  var child = spawn('gulp', argv);

  // don't keep parent process waiting
  child.stdin.end();
  // Handle output
  child.stdout.on('data', function(chunk){
    stdout.write(chunk);
  }).on('end', function(){

    child.kill();

    stdout.write(promptText);
    // provide callback
    if( typeof cb === 'function')
      cb(child)
  })
}