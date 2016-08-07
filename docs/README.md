> Found something wrong or missing? [Open an issue!](open-an-issue)

<h1>documentation</h1>

<h4>Table of contents</h4>

<!-- TOC depthFrom:1 depthTo:4 withLinks:1 updateOnSave:0 orderedList:0 -->

- [Setup](#setup)
- [API](#api)
	- [Gulp.create](#gulpcreate)
	- [Gulp.createClass](#gulpcreateclass)
	- [gulp.task](#gulptask)
	- [gulp.start](#gulpstart)
	- [gulp.series](#gulpseries)
	- [gulp.parallel](#gulpparallel)
	- [gulp.stack](#gulpstack)
- [CLI](#cli)
- [REPL](#repl)
- [Customizable logging](#customizable-logging)

<h2>Introduction</h2>

The module has 2 static methods

[Gulp.create](#gulpcreate) -
[Gulp.createClass](#gulpcreateclass)

the same [gulp API][gulp-api] methods we know and love

[gulp.src](#gulptask) -
[gulp.dest](#gulptask) -
[gulp.task](#gulptask) -
[gulp.watch](#gulptask)

and 3 more to bundle/run tasks

[gulp.series](#gulpseries) -
[gulp.parallel](#gulpparallel) -
[gulp.stack](#gulpstack)

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

  Thats it! When no arguments are given the `default` task will run instead.

3. What about the CLI? Can I just run `gulp-runtime` from the terminal?

  Yes. For this add an alias to your `.bashrc`/`.zshrc`

  ```sh
  alias gulp-runtime='node $(find . -name "gulpfile.js" -not -path "./node_modules/*" | head -n1)'
  ```

  which will use the first `gulpfile.js` found in the current working directory excluding `node_modules`.

  Right after this open a new terminal tab and write

  `gulp-runtime --tasks default watch serve`

## API

<h3> Static methods </h3>

The module exports a constructor function

```js
var Gulp = require('gulp-runtime');
```

which has two static methods: `Gulp.create` and `Gulp.createClass`.

#### Gulp.create

```js
function create([Object props])
```

`Gulp.create` returns a new instance with the given `props`.

Defaults are:

- `props.log = true` task logging is enabled, pass `false` to disable it
- `props.repl = false` the REPL is disabled, pass `true` to enable it
- `props.wait = false` tasks will run in **parallel** by default. Pass `wait: true` to make **series** the default when running tasks

- `props.onStackEnd` called when a stack has ended, defaults to empty function
- `props.onHandleEnd` called after a task has ended, defaults to empty function
- `props.onHandleStart` called before a task starts, defaults to empty function
- `props.onHandleError` called when a task throws, defaults to empty function

These callbacks can be overridden in [`gulp.series`](#gulpseries), [`gulp.parallel`](#gulpparallel) and [`gulp.stack`](#gulpstack) passing an object as a last argument.

#### Gulp.createClass

```js
function createClass([Object mixin])
```

`Gulp.createClass` returns a new constructor function that inherits from its parent prototype.

- When `mixin` is given it overrides its parent prototype.
- When `mixin.create` is given it will be used as the instance constructor.

Example:

Say we always want to make instances that log and have a REPL.

```js
var Gulp = require('gulp-runtime').createClass({
  create: function Gulp (props) {
    props = props || {};
    props.log = props.repl = true;
    Gulp.super_.call(this, props);
  }
});

exports = module.exports = Gulp;
```

<h3>Instance methods</h3>

#### gulp.task

`gulp.src`, `gulp.dest`, `gulp.watch` and `gulp.task` behave the same as described in the [`gulp` API documentation][gulp-api].

In addition task names can use `:parameters` (like expressjs routes) and have `arguments` passed from other task or task runner.

`:parameters` example:

```js
var gulp = require('gulp-runtime').create();

gulp.task('build:mode', function (done) {
  console.log(this.params.mode);
  done(); // or do async things
});
```

`done` will be always passed as first argument to the task. It should be used if the task does not return a stream, promise or [RxJS][RxJS] observable.

Tasks parameters can also use regular expressions using parens right after the parameter

```js
var gulp = require('gulp-runtime').create();

gulp.task('build:mode(-dev|-prod)', function (done){
  done(); // or do async things
});
```

To know more about how this tasks names can be set see [parth][parth].

`arguments` example:

```js
var gulp = require('gulp-runtime').create();

gulp.task('build', function (done, sources, dest) {
  var stream = gulp.src(sources)
    // some build steps here

  stream.on('end', function () {
    // pass stream to next task
    done(stream);
  });
});

gulp.task('minify', function (done, stream) {
  return stream
    // minify
    .pipe(gulp.dest(dest));
});

gulp.task('build and min', function (done) {
  gulp.series('build', 'minify')('src/**/*.js', 'dest/source.min.js', done);
});
```

#### gulp.start

Can be used in two ways

```js
function start(tasks...)
```

Runs any number of `tasks...` given with the defaults of the instance.

Each of the `tasks...` can be either a `string` or a `function`.

Example:

```js
var gulp = require('gulp-runtime').create({ wait: true });

function build(done){
  done(); // or do async things
}

gulp.task('thing', function (done){
 setTimeout(done, Math.random()*10);
});

gulp.start(build, 'thing');
// ^ will run in series since the instance was created with `{wait: true}`
```

```js
function start(Array tasks, args...)
```

Same as `start(tasks...)` but passing the `args...` down to each of the tasks run.

#### gulp.series

```js
function series(tasks...[, Object options])
```

`series` bundles the given `tasks...` into one async function and returns it. This function will **always** run the `tasks...` in **series**.

Its sugar on top of [`gulp.stack`][#gulpstack]. See [`gulp.stack`][#gulpstack] for more information about `options`.

#### gulp.parallel

```js
function parallel(tasks...[, Object options])
```

`parallel` bundles the given `tasks...` into one async function and returns it. This function will **always** run the `tasks...` in **parallel**.

Its sugar on top of [`gulp.stack`][#gulpstack]. See [`gulp.stack`][#gulpstack] for more information about `options`.

#### gulp.stack

```js
function stack(tasks...[, Object options])
```

`stack` bundles the given `tasks...` into one async function and returns it.

Each `tasks...` can be either a `string` or a `function`.

If given, `options` will override the instance `props` for this `stack`.

## CLI

The initial aim of this project was to be able to run gulp tasks directly from a  REPL. But when that was then possible, one also wants to be able to run the CLI while using the REPL, right?

For this reason the [gulp cli](https://github.com/gulpjs/gulp/blob/master/docs/CLI.md) commands are set as tasks for each instance. Which lets one use them as tasks.

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

When an instance passes `repl: true` the process running does not exit when all tasks are done. What happens then its that the process will have a REPL listening on `stdin`.

```sh
$ node gulpfile.js
```

press enter and you will see a prompt `>` that will run the tasks defined in the gulpfile

```sh
>
> build less compress png
```

This way you can run tasks in the same way you run commands on the terminal.

How will tasks run with the REPL?

- If those tasks are defined they will run in **parallel**
- If there is more than one instance with `repl: true` the REPL will go through them and run the first task that matched one of those tasks
- If one or more of those tasks is not defined there will be a warning and none of the tasks will run for that instance of any of the other ones.

For more information see [gulp-repl][gulp-repl].

## Customizable logging

Callbacks `onHandleStart`, `onHandleEnd` and `onHandleError` are used to produce logging.

These callbacks can be overridden at a class level with `Gulp.createClass`, add a instance level with `Gulp.create` or at a bunlde/run level with one of the composers (`gulp.start`, `gulp.series`, `gulp.parallel` and `gulp.stack`).

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

gulp.stack('one', 'two', 'three', {
	onHandleError: function (error, task, stack) {
		console.log(task.label, 'is dead');
		console.log(error);
	}
});
```

<!-- links -->

[npm]: https://npmjs.com/gulp-runtime
[gulp]: https://github.com/gulpjs/gulp
[RxJs]: https://github.com/Reactive-Extensions/RxJS
[parth]: https://github.com/stringparser/parth
[license]: http://opensource.org/licenses/MIT
[runtime]: https://github.com/stringparser/runtime
[gulp-repl]: https://github.com/stringparser/gulp-repl
[open-a-issue]: https://github.com/stringparser/gulp-runtime/issues/new
[example-gulpfile]: https://github.com/gulpjs/gulp#sample-gulpfilejs

[gulp-api]: https://github.com/gulpjs/gulp/blob/master/docs/API.md
