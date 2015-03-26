'use strict';

var gulp = require('gulp');
var util = require('./lib/util');
var runtime = require('./.');

if(typeof runtime.repl === 'function'){
  runtime.repl();
}

runtime.task(':handle(\\w+)', function(next){
  if(next.match === 'jsx'){
    throw new Error('Parse Error: Unespected Identifier');
  }
 setTimeout(next, Math.random()*10);
});

runtime.task('default', ['css', 'jsx', 'img']);

runtime.stack('default')();

gulp.task('hello', function(){

});
