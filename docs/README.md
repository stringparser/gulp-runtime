> Found something wrong or missing? [Open an issue!](open-an-issue)

# documentation

The module comes with 2 static methods: [Gulp.create](#gulpcreate) -
[Gulp.createClass](#gulpcreateclass)

The same [gulp API][gulp-api] methods we know and love: [gulp.src](#gulptask) -
[gulp.dest](#gulptask) -
[gulp.task](#gulptask) -
[gulp.watch](#gulptask)

And 4 more to bundle/run tasks: [gulp.start](#gulpstart) -
[gulp.stack](#gulpstack) -
[gulp.series](#gulpseries) -
[gulp.parallel](#gulpparallel)

<!-- TOC depthFrom:1 depthTo:6 withLinks:1 updateOnSave:0 orderedList:0 -->

Table of contents:

- [Setup](#setup)
- [API](#api)
  - [Static methods](#static-methods)
    - [Gulp.create](#gulpcreate)
    - [Gulp.createClass](#gulpcreateclass)
  - [Instance methods](#instance-methods)
    - [gulp.task](#gulptask)
    - [gulp.start](#gulpstart)
    - [gulp.series](#gulpseries)
    - [gulp.parallel](#gulpparallel)
    - [gulp.stack](#gulpstack)
- [CLI](#cli)
- [REPL](#repl)

<!-- /TOC -->

## Setup

1. Install `npm install --save-dev gulp-runtime`

2. Open a `gulpfile`, or [create one][example-gulpfile], and

  change this line

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

  Thats it! When no arguments are given after `gulpfile` the `default` task will run instead.

3. What about the CLI? Can I just run `gulp-runtime` from the terminal?

  Yes. Just add an alias to your `.bashrc`/`.zshrc`

  ```sh
  alias gulp-runtime='node $(find . -name "gulpfile.js" -not -path "./node_modules/*" | head -n1)'
  ```

  which will use the first `gulpfile.js` found excluding `node_modules`.

  Open a new terminal tab and then

  `gulp-runtime --tasks default watch serve`

## API

### Static methods

When you require the module

```js
var Gulp = require('gulp-runtime');
```

you get a constructor with two methods `Gulp.create` and `Gulp.createClass`.

#### Gulp.create

```js
function create(Object options)
```

`Gulp.create` creates a new instance with the given `options`. These options default to:

- `options.log = true` if `false` the instance will have no logging
- `options.repl = false` no REPL by default
- `options.wait = false` tasks run in __parallel__ by default. Pass `wait: true` to make __series__ the default when running tasks

#### Gulp.createClass

```js
function createClass(Object mixin)
```

`Gulp.createClass` creates a new class. `mixin` is mixed in with its parent prototype. If `mixin.create` is given it will be used as constructor.

Example:

Say we always want to create instances that log and have a REPL.

```js
// myGulpConstructor.js

var Gulp = require('gulp-runtime').createClass({
  create: function Gulp (options) {
    options = options || {};
    options.log = true;
    options.repl = true;
    Gulp.super_.call(this, options);
  }
})

exports = module.exports = Gulp;
```

### Instance methods

#### gulp.task

`gulp.src`, `gulp.dest`, `gulp.watch` and `gulp.task` behaves the same as described in the [`gulp` API documentation][gulp-api].

In addition `gulp.task` names can also have `:parameters` (like expressjs routes).

Example:

```js
var gulp = require('gulp-runtime').create();

gulp.task('build:mode', function (done) {
  console.log(this.params.mode);
  done(); // or do async things
});
```

`done` will be always passed as first argument to the task. It should be used if the task does not return a stream, promise or [RxJS][RxJS] observable.

Tasks parameters can also contain use regular expressions

```js
var gulp = require('gulp-runtime').create();

gulp.task('build:mode(-dev|-prod)', function (done){
  done(); // or do async things
});
```

Task names are set using [parth][parth]. If you want to know more there you will find more information about how far these can go.

#### gulp.start

`gulp.start` can be used in two ways

```js
function start(tasks...)
```

Runs any number of `tasks...` given. They will run __parallel__ by default. If the gulp instance was created with `wait: true` they will in __series__ instead.

`tasks...` can be either a `string` (matching one of the tasks registered) or a `function`.

Example:

```js
var gulp = require('gulp-runtime').create();

function build(done){
  done(); // or do async things
}

gulp.task('thing', function (done){
 setTimeout(done, Math.random()*10);
});

gulp.start(build, 'thing');
```

Which is good, but still limits `gulp.start` to the way the tasks were defined. For this reason you can also pass arguments in a more functional way.

```js
function start(Array tasks, args...[, onStackEnd])
```

If `tasks` is an array, these will run with the given `args...`. The last argument may not be a function. If the last argument is a function it will be called when all of the given `tasks` are finished.

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

#### async composers

`gulp.start` just runs tasks which is not enough when you only need to compose them. For this reason we need another function that will bundle and run a set of tasks only when called.

Just as tasks dependencies bundles into one task others, we have 3 async composer functions to help with this (in fact there is only one function and two others are sugar on top).

##### gulp.series

```js
function series(tasks...[, Object options])
```

`gulp.series` stacks the given `tasks...` into one function and returns it. This function __always__ runs all of the defined `tasks...` in __series__.

Its sugar on top of [`gulp.stack`][#gulpstack] to force the tasks to be run in series.

##### gulp.parallel

```js
function parallel(tasks...[, Object options])
```

`gulp.series` stacks the given `tasks...` into one function and returns it. This function __always__ runs all of the defined `tasks...` in __parallel__.

Its sugar on top of [`gulp.stack`][#gulpstack] to force the tasks to be run in series.

##### gulp.stack

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

## CLI

The initial aim of this project was to be able to run gulp tasks directly from a  REPL. But when that was then possible, one also wants to be able to run the CLI while using the REPL, right?

For this reason each of the [gulp cli](https://github.com/gulpjs/gulp/blob/master/docs/CLI.md) commands is defined as a task for the instance. This way you can use these as you would with normal tasks.

Example:

```js
var gulp = require('gulp-runtime').create();

gulp.task('info', ['--tasks', '--version']);
// other tasks...
gulp.task('default', ['info']);
```

## REPL

```js
var gulp = require('gulp-runtime').create({repl: true});
```

When an instance passes `repl: true` the process running will not exit when all tasks are done, instead it will wait and have a REPL listening on `stdin`. This way you can run tasks in the same way you run commands on the terminal.

```sh
$ node gulpfile.js
```

press enter and you will see a prompt `>` that will run the tasks defined in the gulpfile

```sh
>
> build less compress png
```

How will tasks run with the REPL?

- If those tasks are defined they will run in __parallel__
- If there is more than one instance with `repl: true` the REPL will go through them and run the first task that matched one of those tasks
- If one or more of those tasks is not defined there will be a warning and none of the tasks will run for that instance of any of the other ones.

<!-- links -->

[npm]: https://npmjs.com/gulp-runtime
[gulp]: https://github.com/gulpjs/gulp
[RxJs]: https://github.com/Reactive-Extensions/RxJS
[parth]: https://github.com/stringparser/parth
[license]: http://opensource.org/licenses/MIT
[runtime]: https://github.com/stringparser/runtime
[open-a-issue]: https://github.com/stringparser/gulp-runtime/issues/new
[example-gulpfile]: https://github.com/gulpjs/gulp#sample-gulpfilejs

[gulp-api]: https://github.com/gulpjs/gulp/blob/master/docs/API.md
[gulp-what-is]: https://github.com/gulpjs/gulp#what-is-gulp
