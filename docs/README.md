# docs

Something missing or points to improve?

Feel free to open a [new issue][new-issue]

## API

The api is essentially the same as [gulp API][gulp-api]

- [gulp.src](#gulptask)
- [gulp.dest](#gulptask)
- [gulp.task](#gulptask)
- [gulp.watch](#gulptask)

and 4 additional methods

- [gulp.start](#gulpstart)
- [gulp.stack](#gulp.stack)
- [gulp.series](#gulp.series)
- [gulp.parallel](#gulp.parallel)

To use a `gulpfile` you would only have to change this line

```js
var gulp = require('gulp');
```

with this one

```js
var gulp = require('gulp-runtime').create();
```

### gulp.task

`gulp.src`, `gulp.dest`, `gulp.watch` and `gulp.task` behave the same as described in the [`gulp` documentation][gulp-docs].

In addition, `gulp.task` can also define task using `:parameters`. These parameters will then pop up at the tasks's function `this.params`.

Example:

```js
var gulp = require('gulp-runtime').create();

gulp.task('build:mode', function (done) {
  console.log(this.params.mode);
  // do async things
  done(); // or return a stream, promise or RxJS observable
});
```

You could also use a regular expression right after `:mode` or just an regex enclosed in parens as in:

```js
var gulp = require('gulp-runtime').create();

gulp.task('build:mode(-dev|-prod)', function (done){
  // do async things
  done(); // or return a stream, promise or RxJS observable
});
```

More details on what can be a parameter on the [parth][parth] module.

### gulp.start

```js
function start(tasks...[, options])
```

Run any number of `task...` given. Tasks can be either a `string` (that matches one of the tasks registered) or a `function`.

Example:

```js
var gulp = require('gulp-runtime').create();

function build(done){
  // do async things
  done(); // or return a stream, promise or RxJS observable
}

gulp.task('name', function (){

});
```

## Multiple instances

## REPL with autocomplete

## Tasks with parameters

## compose series and parallel tasks

<!-- links -->

[npm]: https://npmjs.com/gulp-runtime
[parth]: https://github.com/stringparser/parth
[license]: http://opensource.org/licenses/MIT
[gulp-api]: https://github.com/gulpjs/gulp/blob/master/docs/API.md
[new-issue]: https://github.com/stringparser/gulp-runtime/issues/new
