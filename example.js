'use strict';

var vfs = require('vinyl-fs');
var gulp = require('./.').create({repl: true});

gulp.task(':handle(css|jsx|img)', function(next){
 next();
});

gulp.stack('jsx css img')();

vfs.watch('test/*.js', null, function(){
  console.log(arguments);
});
