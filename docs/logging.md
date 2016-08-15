[docs](./README.md) -
[API](./API.md) -
[CLI](./CLI.md) -
[Logging](./logging.md) -
[REPL](./REPL.md) -
[task arguments](./task-arguments.md)

# Logging

Callbacks passed to the constructor: `onHandleStart`, `onHandleEnd` and `onHandleError` are used to internally to produce logging but they can be overridden at:

- class level with [`Gulp.createClass`](./API.md#gulpcreateclass)
- instance level with `Gulp.create`
- bunlde/run level using one of the composers ([`gulp.start`](./API.md#gulpstart), [`gulp.series`](./API.md#gulpseries), [`gulp.parallel`](./API.md#gulpparallel) and [`gulp.stack`](./API.md#gulpstack)).

Example:

```js
var MyGulp = require('gulp-runtime').createCLass({
  onHandleEnd: function (task) {
    console.log('end', task.label);
  },
  onHandleStart: function (task) {
    console.log('start', task.label);
  },
  onHandleError: function (error, task, stack) {
    console.log('error!', task.label);
    throw error;
  }
});

var myGulp = MyGulp.create({
  onHandleStart: function (task) {
    console.log(task.label, 'ended!');
  }
});

myGulp.task(':name', function (done) {
  if (this.params && this.params.name === 'three') {
    throw new Error('ups, something broke');
  } else {
    setTimeout(done, 1000);
  }
});

myGulp.stack('one', 'two', 'three', {
  onHandleError: function (error, task, stack) {
    console.log(task.label, 'is dead');
    console.log(error);
  }
})();
```

---
[Back to top ↑](#)
