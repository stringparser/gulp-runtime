
// module dependencies
var spawn = require('child_process').spawn;

// helpers
var stdout = process.stdout;

module.exports = function childGulp(argv){

  // maintain default '--color'
  if(argv[0] !== '--color' && argv[0] !== '--no-color')
    argv.unshift('--color');

  stdout.write('\n Child gulp started '+ JSON.stringify(argv) + '\n\n');
  var child = spawn('gulp', argv);

  // Don't keep parent waiting
  child.stdin.end();

  // Handle output
  child.stdout.on('data', function(chunk){
    stdout.write(chunk)
  }).on('end', function(){
    stdout.write(promptText);
    child.kill();
  })

  return false;
}