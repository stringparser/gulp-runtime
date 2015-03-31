'use strict';

var gulp = require('gulp');
var util = require('./lib/util');
var app = require('./.').readline();

app.set(':handle(\\w+)', function(next){
  if(next.match === 'jsx'){
    throw new Error('Parse Error: Unespected Identifier');
  }
 setTimeout(next, Math.random()*10);
});

var defaultHandle = app.stack('whatever',
  app.stack('css jsx img', {wait: true}), {wait: true}
);

gulp.task('default', defaultHandle);
