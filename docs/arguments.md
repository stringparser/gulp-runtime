[docs](./README.md) -
[API](./API.md) -
[CLI](./CLI.md) -
[REPL](./REPL.md) -
[logging](./logging.md) -
[arguments](./arguments.md)

# Task arguments

Any of the task runners ([`gulp.start`](./API.md#gulpstart), [`gulp.series`](./API.md#gulpseries), [`gulp.parallel`](./API.md#gulpparallel) and [`gulp.stack`](./API.md#gulpstack)) can be used to pass arguments down.

```js
var gulp = require('gulp-runtime').create();
var args = [1, 2, 3];

gulp.task(':name', function (done, one, two, three) {
  console.log(one, two, three);
  done(null, one + two + three);
});

// with gulp.stack
gulp.stack('taskNameHere')(1, 2, 3, function (error, result) {
  if (error) {
    console.log('ups, who farted?');
    console.log(error.stack);
  } else {
    console.log('all right, we are done at', result, 'pm today');
  }
});

// with gulp.start
gulp.task('default', function (done) {
  gulp.start(['taskNameHere'], 1, 2, 3, {
    onStackEnd: function (error, result) {
      if (error) {
        console.log('ups, who farted?');
        console.log(error.stack);
      } else {
        console.log('all right, we are done at', result, 'pm today');
      }
      done();
    }
  })
});
```

---
[Back to top ↑](#)
