
/*
 * Module dependencies;
 */
var merge = require('utils-merge');
var Runtime = require('./runtime');
var completerFn = Runtime.completerFn;


/*
 * Main entry point for the gulp_runtime
 *
 * TODO: add completion
 */

function createRuntime(options){

    var runtime = function(cmd){
      runtime.handle(cmd)
    }

    merge(runtime, Runtime.prototype);

    return runtime;
};

var gulp_runtime = createRuntime()

/*
 * Set up the instance
 */

gulp_runtime.emit('startup', function(){
  this.runtime_name = 'gulp'
  this.setPrompt(' > gulp ');
  this.prompt();
});
  // provide built-in commands
  require('./commands')(gulp_runtime);

/*
 * Expose the `runtime` instance
 */
exports = module.exports = gulp_runtime;