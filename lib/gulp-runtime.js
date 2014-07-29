
/*
 * Module dependencies;
 */
var util = require('util');
var merge = require('utils-merge');
var Runtime = require('./runtime');
var completerFn = require('./runtime').completerFn;


/*
 * Main entry point for the gulp_runtime
 *
 * TODO: add completion
 */
var gulp_runtime = Runtime.createInterface({
  input : process.stdin,
  output : process.stdout,
  completer : completerFn
});

/*
 * Set up the instance
 */

gulp_runtime.onStartup(function(){
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
