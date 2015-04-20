## gulp-runtime documentation

The `module.exports` a function

```js
var create = require('gulp-runtime');
```

### create
```js
function create([string name|object options, object options])
```
Key-value store for instances.
 - Sets a new instance `name` if there wasn't one.
 - Gets an instance `name` previously instantiated.

Any instance can be tranformed into a repl passing `{repl: true}` as options.

_arguments_
 - `name` type string, the name given for the instance
 - `options` type object, options passed down to the instance
  - `options.log` type boolean, whether to log or not
  - `options.repl` type boolean, whether to make a repl with the instance
  - `options.input` type stream, input stream for the repl
  - `options.output` type stream, output stream for the repl

_defaults_
 - `name` defaults to `#root`
 - if `options.repl` or `options.input` is truthy a repl is created
  at `instance.repl` using the [readline][m-readline] module
  - if `options.input` is not a stream, to `process.stdin`
  - if `options.output` is not a stream, to `process.stdout`

_returns_
 - an existing instance `name` if `name` is given
 - a new instance if there wasn't `name` wasn't created before

#### runtime.task
```js
function task(string name[, string|array deps, function handle])
```

_arguments_
- `name` type string, parsed and stored with [parth][p-parth] for later lookup
- `deps` type array or string, tasks to run before this one in series. If tasks are given as a string they must be space separated.
- `handle` type function to call when `runtime.stack` is used.

**_throws_**
 - if types doesn't match
 - if `handle` does not return or uses a callback
 - if there is a circular dependency for the task given

_returns_ `this`

### runtime.src
```js
function src(string|array glob[, object opt])
```
Same as [vinylFs.src][p-vinylFs.src]

### runtime.dest
```js
function dest(string|function folder[, object opt])
```
Same as [vinylFs.dest][p-vinylFs.dest]

### runtime.watch
```js
function watch(string|array glob[, string|array|object opt, function cb])
```

Uses [vinylFs.watch][p-vinylFs.watch] (run tasks when files change).

Additional features:
  - Files can be reloaded on the `require.cache`
  - Tasks can be run in series directly if so specified

_arguments_
 - `tasks` can be a string, space separated tasks will be dispatched as written
 - when `opt` is an object, it can have non mandatory properties below
  - `opt.wait` type boolean, if `opt.tasks` should run in series or not
  - `opt.tasks` type array|string, tasks to run after change and before reload
  - `opt.reload` type boolean, wether or not to reload a file

_defaults_
 - `opt.wait` to `false`
 - `opt.reload` to `undefined`

_returns_
 - a watcher, [vinylFs.watch][p-vinylFs.watch]

> Notes:
- callback arguments are (a gaze event, the `opt`s given)
- Only files one of the `require.extensions` will be reloaded
- When a file is deleted on disk, the reload will be skipped but the
callback is still invoked

```js
var gulp = require('gulp-runtime').create();

gulp.watch('app/*.*', {
  wait: true,  // run tasks after change in series
  tasks: 'sass css jsx browserSync',
  reload: true // reload app/*.js files as they change
}, function(ev, opt){
  var reloaded = opt.reload && ev.type !== 'delete';
  console.log('%s was %s', ev.path, ev.type, reloaded ? 'and reloaded' : '');
});
```

### runtime.stack
```js
function stack(...arguments[, object props])
```

Returns a function which after call will invoke and give context to its `...arguments`.

_arguments_
- `...arguments`, type string or function
- `props`, type object, properties for the stack. Look at [the tornado stack API][t-stack].

**_throws_**
 - when no arguments are given

_returns_
- a `tick` callback, which, upon call will execute the stack arguments

<!-- links
  b-: is for badges
  p-: is for package
  t-: is for doc's toc
  x-: is for just a link
-->

[x-npm]: https://www.npmjs.org
[t-stack]: https://github.com/stringparser/tornado/blob/master/docs/stack.md
[p-parth]: https://github.com/stringparser/parth
[x-gitter]: https://gitter.im/stringparser/gulp-runtime
[p-tornado]: https://github.com/stringparser/tornado
[m-readline]: https://nodejs.org/api/readline.html
[x-gulp-cli]: https://github.com/gulpjs/gulp/blob/master/docs/CLI.md
[x-new-issue]: https://github.com/stringparser/gulp-runtime/issues/new
[p-gulp-runtime]: https://npmjs.com/gulp-runtime
[p-tornado-repl]: https://github.com/stringparser/tornado-repl
[x-app-template]: https://github.com/stringparser/app-template

[p-vinylFs]: https://github.com/wearefractal/vinyl-fs
[p-vinylFs.src]: https://github.com/wearefractal/vinyl-fs#srcglobs-opt
[p-vinylFs.dest]: https://github.com/wearefractal/vinyl-fs#destfolder-opt
[p-vinylFs.watch]: https://github.com/wearefractal/vinyl-fs#watchglobs-opt-cb
