'use strict';

var util = require('../util');
var vinylFS = require('vinyl-fs');
var tornado = require('tornado-repl');

var Stack = tornado.Stack;
var Runtime = tornado.Runtime;

// String to function mapping failed, handle it
//
Stack.prototype.onHandleNotFound = function(next){
  var path = util.color.cyan(next.match || next.path);
  console.log('%s found for `%s`', util.color.red('No task'), path);
  console.log('Set one with `task(\'%s\', [Function])`', path);
  if(this.runtime.repl){ return next(); }
  process.exit(1);
};

// Errors anywhere in the stack
//
Stack.prototype.onHandleError = function(error, next){
  if(!(error instanceof Error)){ return next(); }

  util.log('Error in \'%s\' after %s\n%s',
    util.color.cyan(next.match),
    util.color.time(next.time),
    error.stack
  );

  next.error = error;
  if(this.runtime.repl){ return next(); }
  process.exit(1);
};

// Make a logger that looks similar to gulp's
//
Stack.prototype.onHandle = function(next){
  if(next.error || !this.log || /^-/.test(next.match)){
    return ; // ^ skip logging for errors, silent or flags
  }

  if(this.configFile === void 0){
    this.configFile = util.configFile();
    this.runtime.set({configFile: this.configFile});
    if(this.configFile instanceof Error){ return ; }
    util.log('Using', util.color.file(this.configFile));
  }

  var host = '';
  if(this.host){
    host = '(' + util.color.green(this.host.path) + ') ';
  }

  if(!this.time){
    util.log('%sStarted \'%s\' in %s',
      host,
      util.color.cyan(this.path),
      util.color.bold(this.wait ? 'series' : 'parallel')
    );
    this.time = process.hrtime();
  } else if(next.time && next.match && next.match !== this.path){
    util.log('%sFinished \'%s\' after %s',
      host, util.color.cyan(next.match), util.color.time(next.time)
    );
  }

  if(!next.time){ next.time = process.hrtime(); }
  if(this.queue || this.time.end){ return ; }

  this.time.end = util.color.time(this.time);
  util.log('%sFinished \'%s\' after %s',
    host, util.color.cyan(this.path), this.time.end
  );
};


/*
# runtime.src
```js
function src(string|array glob[, object opt])
```
Same as [vinylFs.src][p-vinly-fs-src]
*/

Runtime.prototype.src = vinylFS.src;

/*
# runtime.dest
```js
function dest(string|function folder[, object opt])
```
Same as [vinylFs.dest][p-vinly-fs-dest]
*/
Runtime.prototype.dest = vinylFS.dest;

/*
# runtime.task
```js
function task(string name[, string|array dep, function handle])
```
_arguments_
 - are same as [gulp.task][m-gulp-task] aside of `dep`
 - `dep` type array or string, tasks to run before this one
 if given as a string they must be space separated

_returns_ differences with [gulp.task][m-gulp-task]
 - the function of the task `name`, if it was set before
 - this otherwise (just as [gulp.task][m-gulp-task])
*/

Runtime.prototype.task = function(name, deps, handle){
  var handleType = util.type(handle || deps);

  if(typeof name !== 'string'){
    throw new TypeError(
      'task(string name, [string|array dep, function handle])\n'+
      '- Tasks require a string `name`'
    );
  } else if(!handleType.match(/function|array|string/)){
    throw new TypeError(
      'task(string name, [string|array dep, function handle])\n' +
      'New tasks need at lest 2 arguments\n'+
      ' - deps: dependencies to run before this one'+
      ' - handle: function that runs the task\n'+
      '\n'
    );
  }

  var error;
  // TODO: checking handle completion should be more robust
  //
  handle = handleType.function || function(next){ next(); };
  if(!handle.length && !/return/.test(handle.toString())){
    name = util.color.cyan(name);
    error = new Error(
      'task `'+name+'` doesn\'t give a hint of its completion\n'+
      'Meaning: it doesn\'t return nor uses a callback\n'+
      'Solution:\n'+
      ' - return a stream, promise or observable\n'+
      ' - use the callback that is passed as first argument\n--'
    );
    util.color.callersPath(error);
    throw error;
  }

  if(!handle.name && !handle.displayName){
    handle.displayName = name;
  }

  var depsType = util.type(deps);
  if(!depsType.match(/array|string/) || !deps.length){
    return this.set(name, handle);
  }
  deps = depsType.array || deps.trim().split(/[ ]+/);

  // TODO: prevent circular dependencies
  //
  return this.set(name, {
    dep: deps,
    handle: this.stack(deps.join(' '), handle, {wait: true})
  });
};

/*
# runtime.watch
```js
function watch(string|array glob[, string|array|object opt, function cb])
```

Same as [gulp.watch][m-gulp-watch] (run tasks when files change).
Additional features:
  - Files can be reloaded on the `require.cache`
  - Tasks can be run in series directly if so specified

_arguments_ differences with [gulp.watch][m-gulp-watch]
 - `tasks` can be a string, space separated tasks will be dispatched as written
 - when `opt` is an object, it can have non mandatory properties below
  - `opt.wait` type boolean, if `opt.tasks` should run in series or not
  - `opt.tasks` type array|string, tasks to run after change and before reload
  - `opt.reload` type boolean, wether or not to reload a file

_defaults_
 - `opt.wait` to `false`
 - `opt.reload` to `undefined`

_returns_
 - a watcher, same as [gulp.watch][m-gulp-watch]

> Notes:
- callback arguments are (a gaze event, the `opt`s given)
- Only files with a registered `require.extension` will be reloaded
- When a file is deleted on disk, the reload will be skipped but the
callback is still invoked

```javascript
var gulp = require('gulp-runtime').create();

var watcher;
watcher = gulp.watch('app/*.js', 'minify browserSync');

gulp.watch('app/*.*', {
  wait: true,  // run tasks after change in series
  tasks: 'sass css jsx browserSync',
  reload: true // will only reload app/*.js files (server, db, etc)
}, function(ev, opt){
  var reloaded = opt.reload && ev.type !== 'delete';
  console.log('%s was %s', ev.path, ev.type, reloaded ? 'and reloaded' : '');
});
```
**/
Runtime.prototype.watch = function(glob, opt, cb){
  cb = util.type(cb || opt).function;
  opt = util.type(opt).plainObject || {tasks: opt};

  if(cb || opt.reload){
    opt.onHandleEnd = function(next, ev){
      if(this instanceof Stack && (this.queue || this.host)){return ;}
      if(util.shouldReloadFile(opt, ev)){
        delete require.cache[ev.path];
        require(ev.path);
      }
      if(cb){ cb(ev, opt); }
    };
  }

  var tasks = util.type(opt.tasks);
  if(tasks.string || tasks.array){
    tasks = tasks.string || tasks.array.join(' ');
    return vinylFS.watch(glob, this.stack(tasks, opt));
  }

  return vinylFS.watch(glob, opt, opt.onHandleEnd);
};

// export back tornado
//
exports = module.exports = tornado;
