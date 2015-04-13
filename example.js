'use strict';

var gulp = require('./.').create();

gulp.task(':handle(css|jsx|img|browserify)', function(next){
 setTimeout(next, Math.random()*10);
});

gulp.stack('css', gulp.stack('jsx img', gulp.stack('browserify')))();
