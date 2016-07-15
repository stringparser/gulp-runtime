# documentation

API -
REPL -
instances -
task params -
async composers

## setup

> gulp what?

  If you don't know gulp [go here first][gulp]

> Install with [npm][npm]

  `npm install --save-dev gulp-runtime`

> Then open your favourite editor

  Go to that `gulpfile` and change this line

  ```js
  var gulp = require('gulp');
  ```

  with

  ```js
  var gulp = require('gulp-runtime').create();
  ```

  After that just run `gulpfile` with `node` directly from the command line

  ```sh
  node gulpfile.js --tasks default watch serve
  ```

  If no argument is given the `default` task will run instead (as gulp does).

> What about the CLI?

  Add an alias to your `.bashrc`, `.zshrc`

  ```sh
  rulp='node gulpfile.js'
  ```

## API

The module comes with the same [gulp API][gulp-api] methods we know and love

[gulp.src](#gulptask) |
[gulp.dest](#gulptask) |
[gulp.task](#gulptask) |
[gulp.watch](#gulptask)

and 4 more

[gulp.start](#gulpstart) |
[gulp.stack](#gulpstack) |
[gulp.series](#gulpseries) |
[gulp.parallel](#gulpparallel)

### gulp.task

`gulp.src`, `gulp.dest`, `gulp.watch` and `gulp.task` behave the same as described in the [`gulp` API documentation][gulp-api].

In addition `gulp.task` can also define tasks using `:parameters`.

Example:

```js
var gulp = require('gulp-runtime').create();

gulp.task('build:mode', function (done) {
  console.log(this.params.mode);
  // do async things
  done(); // or return a stream, promise or RxJS observable
});
```

You could also use a regular expression right after `:mode`

```js
var gulp = require('gulp-runtime').create();

gulp.task('build:mode(-dev|-prod)', function (done){
  // do async things
  done(); // or return a stream, promise or RxJS observable
});
```

For more regex madness on the [parth][parth] module.

### gulp.start

```js
function start(tasks...)
```

Run any number of `tasks...` given. Tasks can be either a `string`, that matches one of the tasks registered with or without its parameters, or a `function`.

Example:

```js
var gulp = require('gulp-runtime').create();

function build(done){
  done(); // or do async things
}

gulp.task('thing', function (done){
 setTimeout(done, 100);
});

gulp.start(build, 'thing');
```
___

```js
function start(array tasks, args...)
```

If the first argument is an array its taken as the tasks to run and the rest of arguments as the arguments to pass to the tasks to run.

```js
var gulp = require('gulp-runtime').create();

function build(done, a, b){
  done(); // or do async things
}

gulp.task('thing', function (done, a, b){
 setTimeout(done, 100);
});

gulp.task('build thing', function (done, a, b){
  gulp.start([build, 'thing'], a, b, done);
  // done will be called when all of the tasks have ended or there is an error
});

gulp.task('default', function () {
  gulp.start('build things', 'a', 'b');
});
```

## REPL

## instances

## task parameters

## async composers

<!-- links -->

[npm]: https://npmjs.com/gulp-runtime
[gulp]: https://github.com/gulpjs/gulp
[parth]: https://github.com/stringparser/parth
[license]: http://opensource.org/licenses/MIT
[gulp-api]: https://github.com/gulpjs/gulp/blob/master/docs/API.md
[new-issue]: https://github.com/stringparser/gulp-runtime/issues/new
