'use strict';

var path = require('path');
var util = require('./util');
var vinylFS = require('vinyl-fs');
var tornado = require('tornado-repl');

var Stack = tornado.Stack;
var Runtime = tornado.Runtime;

// String to function mapping failed, handle it
//
Stack.prototype.onHandleNotFound = function(next){
  var path = next.match || next.path;
  var message = 'no task found for `'+path+'`.\n'+
    'Set one with `task(\''+path+'\', [Function])`';

  if(this.runtime.repl){
    util.log('Warning:', message);
    this.log = false;
    return next();
  }

  throw new Error(message);
};

// Errors anywhere in the stack
//
Stack.prototype.onHandleError = function(error, next){
  if(!(error instanceof Error)){ return next(); }
  var file = error.stack.match(/\(?(\S+:\d+:\d+)\)?/);
  file = path.resolve(process.cwd(), file[1]);

  util.log('Error in \'%s\' after %s at %s\n%s',
    util.color.cyan(next.match),
    util.color.time(next.time),
    util.color.file(file),
    error.stack
  );

  next.error = error;
  if(!this.runtime.repl){
    process.exit(1);
  }
  next();
};

// Make a logger that looks like gulp's
//
Stack.prototype.onHandle = function(next){
  if(next.error || !this.log || /^-/.test(next.match)){
    return ; // ^ skip logging for errors, silent or flags
  }

  if(!this.configFile){
    this.configFile = process.argv[1];
    this.runtime.set({configFile: this.configFile});
    util.log('Using', util.color.file(process.argv[1]));
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
  } else if(next.time && /[ ]+/.test(this.path)){
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
Same as [vinylFs.src][m-vinly-fs-src]
*/

Runtime.prototype.src = vinylFS.src;

/*
# runtime.dest
```js
function dest(string|function folder[, object opt])
```
Same as [vinylFs.dest][m-vinly-fs-dest]
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

Runtime.prototype.task = function(name, dep, handle){
  var task = this.get(name, {ref:true});
  if(task !== this.store && task.handle){ return task.handle; }
  var handleType = util.type(handle || dep);

  if(typeof name !== 'string'){
    util.log('From `%s`', util.color.yellow('gulp-runtime'));
    throw new TypeError(
      'task(name, handle). Tasks require a string `name`'
    );
  } else if(!handleType.match(/function|array/)){
    util.log('From `%s`', util.color.yellow('gulp-runtime'));
    throw new TypeError(
      'task(name, [deps, handle]).' +
      'New tasks need at lest 2 arguments\n'+
      ' - deps: array|string of dependencies to run before this one'+
      ' - handle: function that runs the task\n'+
      '\n'
    );
  }

  handle = handleType.function || function(next){ next(); };
  if(!handle.name && !handle.displayName){
    // fill in name for unnamed handlers
    handle.displayName = name;
  }

  var depType = util.type(dep);
  if(!depType.match(/array|string/) || !dep.length){
    // no dependencies
    return this.set(name, handle);
  }

  dep = depType.string || dep.join(' ');
  return this.set(name, {
    dep: dep.trim().split(/[ ]+/),
    handle: this.stack(dep, handle, {wait: true})
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
 - `opt.wait` to `true`
 - `opt.reload` to `undefined`

_returns_
 - a watcher, same as [gulp.watch][m-gulp-watch]

> Notes:
- The callback arguments are:
  - a gaze event
  - the `opt` argument given
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
Runtime.prototype.watch = function(glob, opt, fn){
  var cb = util.type(fn || opt).function;
  var o = cb !== fn && util.type(fn).plainObject
    || cb !== opt && util.type(opt).plainObject
    || {tasks: opt, wait: true};

  var reload = o.reload && function reloadHandle(ev){
    if(ev.type !== 'delete' && require.extension[path.extname(ev.path)]){
      delete require.cache[ev.path];
      require(ev.path);
    }
    if(cb){ cb(ev, o); }
  };

  var tasks = util.type(o && o.tasks || o);
  if(tasks.string || tasks.array){
    tasks = tasks.string || tasks.array.join(' ');
    return vinylFS.watch(glob, null, reload
      ? this.stack(tasks, reload, o)
      : this.stack(tasks, o)
    );
  }

  return vinylFS.watch(glob, o, reload || function onChange(ev){
    if(cb){ cb(ev, o); }
  });
};

// export back tornado
//
exports = module.exports = tornado;
