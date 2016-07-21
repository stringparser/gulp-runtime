> Find something missing? [Open an issue](open-an-issue)

[gulp.task](#gulptask) -
[gulp.src](#gulptask) -
[gulp.dest](#gulptask) -
[gulp.watch](#gulptask) <br>
[gulp.start](#gulpstart) -
[gulp.stack](#async-composers) -
[gulp.series](#async-composers) -
[gulp.parallel](#async-composers)

# documentation

## Setup

1. You don't know gulp? [First go here][gulp-what-is]

2. Install `npm install --save-dev gulp-runtime`

3. Open a `gulpfile` (or [create one][example-gulpfile]) and change this line

  ```js
  var gulp = require('gulp');
  ```

  with

  ```js
  var gulp = require('gulp-runtime').create();
  ```

  After that run the `gulpfile` with `node` directly from the command line

  ```sh
  node gulpfile.js default watch serve
  ```

  Thats it! If no arguments are given after the gulpfile the `default` task will run instead.

4. What about the CLI? Can I run `gulp` from the terminal?

  Yes. Just add an alias to your `.bashrc`/`.zshrc`

  ```sh
  alias gulp-runtime='node $(find . -name "gulpfile.js" -not -path "./node_modules/*" | head -n1)'
  ```

  (or change it to your preferences). With that you can use

  `gulp-runtime --tasks default watch serve`

  directly from the terminal.

5. And what about CLI commands like `--tasks`, `--version`, etc.?

  Each of the [gulp cli](https://github.com/gulpjs/gulp/blob/master/docs/CLI.md) commands is defined as a task for the instance. So you can use these as you would with normal tasks.

  Example:

  ```js
  var gulp = require('gulp-runtime').create();

  gulp.task('info', ['--tasks', '--version']);
  // other tasks...
  gulp.task('default', ['info']);
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

you get a constructor

### Static methods

#### Gulp.create

```js
function create(Object options)
```

`Gulp.create` creates a new `gulp` instance with the given `options`. These options default to:

- `options.log = true` if `false` the instance will have no logging
- `options.repl = false` no REPL by default
- `options.wait = false` tasks run in __parallel__ by default. Pass `wait: true` to run tasks in __series__

#### Gulp.createClass

```js
function createClass(Object mixin)
```

`Gulp.createClass` creates a new `Gulp` class with the given `mixin` mixed in with its parent prototype. If `mixin.create` is given it will be used as constructor.

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

### Instance methods

Exactly, instances. You can split builds into instances within the same process and run them separately.

#### gulp.task

`gulp.src`, `gulp.dest`, `gulp.watch` and `gulp.task` behave the same as described in the [`gulp` API documentation][gulp-api].

In addition `gulp.task` task names can also have `:parameters` (like expressjs routes).

Example:

```js
var gulp = require('gulp-runtime').create();

gulp.task('build:mode', function (done) {
  console.log(this.params.mode);
  done(); // or do async things
});
```

or even have regular expression right after the parameter

```js
var gulp = require('gulp-runtime').create();

gulp.task('build:mode(-dev|-prod)', function (done){
  done(); // or do async things
});
```

The parameters are defined using [parth][parth]. There you will find more information about what qualifies as parameter and what not.

#### gulp.start

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
Or, in order to give arguments to the tasks, you can use

```js
function start(Array tasks, args...[, onStackEnd])
```

If `tasks` is an array it will be taken as the tasks to run and the rest of arguments are passed down. If the last argument is a function it will be called when all of the given `tasks` are finished.

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

### async composers

`gulp.start` is not enough when you need to compose tasks since it runs them. If you want to compose tasks, you need another function that will run a set of tasks.

So, just as tasks dependencies bundle in one task others, we have 3 async composer functions to help with this (in fact there is only one function and two others are sugar on top).

#### gulp.series

```js
function series(tasks...[, Object options])
```

`gulp.series` stacks the given `tasks...` into one function and returns it. This function __always__ runs all of the defined `tasks...` in __series__.

Its sugar on top of [`gulp.stack`][#gulpstack] to force the tasks to be run in series.

#### gulp.parallel

```js
function parallel(tasks...[, Object options])
```

`gulp.series` stacks the given `tasks...` into one function and returns it. This function __always__ runs all of the defined `tasks...` in __parallel__.

Its sugar on top of [`gulp.stack`][#gulpstack] to force the tasks to be run in series.

#### gulp.stack

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
- If one or more of those tasks is not defined there will be a warning and none of the tasks will run for that instance of any of the other ones.

<!-- links -->

[npm]: https://npmjs.com/gulp-runtime
[gulp]: https://github.com/gulpjs/gulp
[parth]: https://github.com/stringparser/parth
[license]: http://opensource.org/licenses/MIT
[runtime]: https://github.com/stringparser/runtime
[open-a-issue]: https://github.com/stringparser/gulp-runtime/issues/new
[example-gulpfile]: https://github.com/gulpjs/gulp#sample-gulpfilejs

[gulp-api]: https://github.com/gulpjs/gulp/blob/master/docs/API.md
[gulp-what-is]: https://github.com/gulpjs/gulp#what-is-gulp
