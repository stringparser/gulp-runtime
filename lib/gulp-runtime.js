
/*
 * Module dependencies;
 *
 * Main entry point for the gulp_runtime
 * TODO: add completion
 *
 */
var Runtime = require('./runtime')
var gulp_runtime = Runtime.createInterface({
      input : process.stdin,
     output : process.stdout,
  completer : Runtime.completerFn
});

/*
 * Set up the instance
 */

gulp_runtime.onStartup(function(){
  this.runtime_name = 'gulp'
  this.setPrompt(' > gulp ');
});

// provide built-in commands
require('./cmd')(gulp_runtime);


/*
 * Expose the `runtime` instance
 */
exports = module.exports = gulp_runtime;
