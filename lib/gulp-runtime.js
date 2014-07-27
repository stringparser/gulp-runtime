
/*
 * Module dependencies;
 */
var gulp = require('gulp');
var Runtime = require('./runtime');

var gulp_runtime = exports = module.exports = {};


/*
 * Main entry point for the gulp_runtime
 */
var runtime = new Runtime({
  input : process.stdin,
  output : process.stdout
})

//
// Set up the instance
runtime.setPrompt(' > gulp ');
  require('./commands')(runtime);

/*
 * exported methods
 */
[
'prompt',
'setPrompt',
'set',
'get',
'handle'
].forEach(function(method){
  gulp_runtime[method] = runtime[method]
})