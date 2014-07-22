
// module dependencies
var initCli = require('./runtime').initCli
  , cliText = require('./runtime').cliText;

// helpers
var stdin = process.stdin
  , stdout = process.stdout

module.exports = function initRuntime(gulp){

  var runtime = {
    cli : initCli(gulp),
  };

  runtime.onEnd = gulp.doneCallback = function onEndTasks(){
    // hack : there should be a better way
    // i.e. using a setInterval for example
    // and checking number of tasks
    setTimeout(function(){
      runtime.instance = gulp;
      runtime.cli.prompt();
    }, 500)
  };

  return runtime;
}