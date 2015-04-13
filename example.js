'use strict';

var gulp = require('./.').create({repl: true});

gulp.task(':handle(css|jsx|img)', function(next){
  if(next.match === 'jsx'){
    throw new Error('Parse Error: Unespected Identifier');
  }
 setTimeout(next, Math.random()*10);
});

gulp.stack('css jsx img', {wait: true})();
