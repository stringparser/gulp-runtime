# documentation

API -
REPL -
instances -
task params -
async composers

## setup

_gulp what?_ If you don't know gulp [go here first][gulp]

_install the module_ `npm install --save-dev gulp-runtime`

_Open that `gulpfile` (or [create one][example-gulpfile]_) and change this

```js
var gulp = require('gulp');
```

with

```js
var gulp = require('gulp-runtime').create();
```

After that just run the `gulpfile` with `node` directly from the command line

```sh
node gulpfile.js default watch serve
```

If no arguments are given the `default` task will run instead (as gulp does).

- _What about the CLI?_

Add an alias to your `.bashrc`/`.zshrc`

```sh
rulp='node gulpfile.js'
```

## API

The module comes with the same [gulp API][gulp-api] methods we know and love

[gulp.src](#gulptask) -
[gulp.dest](#gulptask) -
[gulp.task](#gulptask) -
[gulp.watch](#gulptask)

and 4 more

[gulp.start](#gulpstart) -
[gulp.stack](#async-composers) -
[gulp.series](#async-composers) -
[gulp.parallel](#async-composers)

When you require the module

```js
var Gulp = require('gulp-runtime');
```

you get a constructor with 2 static methods

### Gulp.create

```js
function create(Object options)
```

`Gulp.create` creates a new `gulp` instance with the given `options`. These options default to:

 - `options.log = true`, pass `false` for an instance with no logging
 - `options.repl = false`, by default the REPL is deactivated
 - `options.wait = false`, by default all tasks are run in __parallel__ set to `true` for this instance to run tasks in `series` always

> Is more convenient to use `create` instead of `new Gulp` but its up to you

### Gulp.createClass

```js
function createClass(Object mixin)
```

`Gulp.createClass` creates a new `Gulp` class with the given `mixin` mixed in with its parent prototype. If you give a `mixin.create` it will be used as constructor instead of using a placeholder function for the constructor.

Example:

```js
var Gulp = require('gulp-runtime').createClass({
  create: function Gulp (options) {
    options = options || {};
    options.log = true;
    options.repl = true;
    Gulp.super_.call(this, options);
  }
})
```

> This method was needed to create gulp-runtime from [runtime][runtime]

### gulp.task

`gulp.src`, `gulp.dest`, `gulp.watch` and `gulp.task` behave the same as described in the [`gulp` API documentation][gulp-api].

In addition, `gulp.task` can also define tasks using `:parameters`.

Example:

```js
var gulp = require('gulp-runtime').create();

gulp.task('build:mode', function (done) {
  console.log(this.params.mode);
  done(); // or do async things
});
```

You could also use a regular expression right after `:mode`

```js
var gulp = require('gulp-runtime').create();

gulp.task('build:mode(-dev|-prod)', function (done){
  done(); // or do async things
});
```

Task can be defined in any order.

_What? Regular expressions?_

If you care about this part continue here [parth][parth].

### gulp.start

`gulp.start` can be used in two ways

```js
function start(tasks...)
```

Runs any number of `tasks...` given in __parallel__.

`tasks...` can be either a `string` (matching one of the tasks registered) or a `function`.

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
function start(Array tasks, args...)
```

If the `tasks` is an array these will be the tasks to run (either `string` or `function`) and the rest of arguments are passed to the tasks that will run.

```js
var gulp = require('gulp-runtime').create();

function build(done, a, b){
  done(); // or do async things
}

gulp.task('watch-serve', function (done, a, b){
 done(); // or do async things
});

gulp.task('build dev', function (done, a, b){
  gulp.start([build, 'watch-serve'], a, b, done);
  // done will be called when all of the tasks have ended or there is an error
});

gulp.task('default', function (done) {
  gulp.start(['build dev'], 'a', 'b', done);
  // or
  // gulp.series('build dev')('a', 'b', done);
  // or
  // gulp.parallel('build dev')('a', 'b', done);
});
```

## REPL

```js
var gulp = require('gulp-runtime').create({repl: true});
```

When an instance passes `repl: true` the process running will not stop but wait and have a REPL listening on `stdin`. This way you can run tasks in the same way you run commands on the terminal.

```js
node gulpfile.js
# some task logging here...
# when done press enter
> build less compress png
```

- If those tasks are defined they will run in __parallel__
- If there is more than one instance with `repl: true` the REPL will go through them and run the first task that matched one of those tasks
- If one or more of those tasks is not defined there will be a warning and none of the tasks will run for that instance of any of the other ones

## async composers

`gulp.start` is not enough when you need to compose tasks since it runs them. If you want to compose tasks, you need another function that will run a set of tasks.

So, just as tasks dependencies bundle in one task others, we have 3 async composer functions to help with this (in fact there is only one function and two others are sugar on top).

### gulp.series

```js
function series(tasks...[, Object options])
```

`gulp.series` stacks the given `tasks...` into one function and returns it. This function __always__ runs all of the defined `tasks...` in __series__.

Its sugar on top of [`gulp.stack`][#gulpstack] to force the tasks to be run in series.

### gulp.parallel

```js
function parallel(tasks...[, Object options])
```

`gulp.series` stacks the given `tasks...` into one function and returns it. This function __always__ runs all of the defined `tasks...` in __parallel__.

Its sugar on top of [`gulp.stack`][#gulpstack] to force the tasks to be run in series.

### gulp.stack

```js
function stack(tasks...[, Object options])
```

`gulp.stack` stacks the given `tasks...` into one function and returns it. A function which by default runs them in __parallel__.

`tasks...` can be either `strings` or `functions`
`options` determines how logging and errors are handled or tasks can be run

  - `options.wait`, default `false` for parallel, `true` if tasks should run in series
  - `options.onHandleStart` if given, will run before a task is run
  - `options.onHandleEnd` if given, will run after a task has ended
  - `options.onHandleError` if given, will run when a task errors
  - `options.onStackEnd` if given, will run when all of the stacked functions have ended (including error)

## instances

Exactly, instances. That means that you can split builds into instances within the same process and run them separately. Which is a bit better than taking care of naming or spin another process to run them separated. This is also better for performance since all of the modules that may be used by other build can be reused.

The down side is that the REPL will run the first matching task from those instances that use a REPL.

<!-- links -->

[npm]: https://npmjs.com/gulp-runtime
[gulp]: https://github.com/gulpjs/gulp
[parth]: https://github.com/stringparser/parth
[license]: http://opensource.org/licenses/MIT
[runtime]: https://github.com/stringparser/runtime
[gulp-api]: https://github.com/gulpjs/gulp/blob/master/docs/API.md
[new-issue]: https://github.com/stringparser/gulp-runtime/issues/new
[example-gulpfile]: https://github.com/gulpjs/gulp#sample-gulpfilejs
