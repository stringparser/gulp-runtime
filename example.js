'use strict';

var gulp = require('gulp');
var util = require('./lib/util');
var runtime = require('./.').readline();

runtime.task(':handle(\\w+)', function(next){
  if(next.match === 'jsx'){
    throw new Error('Parse Error: Unespected Identifier');
  }
 setTimeout(next, Math.random()*10);
});

runtime.task('default', ['css', 'jsx', 'img']);

var defaultHandle = runtime.stack('whatever', runtime.stack('css jsx img', {wait: true}), {wait: true});
gulp.task('default', defaultHandle);
