'use strict';

var gulp = require('./.').create();

gulp.task(':handle(css|jsx|img)', 'jsx css', function(next){
 next();
});
console.log(gulp.get('jsx css img'));

var count = 0;
gulp.stack('jsx css img', {
  onHandleCall: function(next){
    if(++count > 2){
      process.exit(1);
    }
  }
})();
