
var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = gutil.colors;

var runtime = module.exports = new require('./runtime').Runtime('gulp');

runtime({ env : process.env });

runtime.set('hello', function(argv, args, next){ /*...*/ })
       .set('world', function(argv, args, next){ /*...*/ })
       .get('hello')  // goes to the first command again
       .set('mundo', function(argv, args, next){ /*...*/ })

runtime.require('./gulp-cli');
gulp.doneCallback = function(){
  runtime.prompt();
  gulp.doneCallback = undefined;
}

console.log(require('util').inspect(runtime.get(), { depth : null }))