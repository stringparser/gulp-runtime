'use strict';

var path = require('path');
var util = require('./lib/util');
var vinylFS = require('vinyl-fs');
var tornado = require('tornado-repl');

/*
# runtime.src
```js
function src(string|array glob[, object opt])
```
Same as [vinylFs.src][m-vinly-fs-src]
*/

tornado.Runtime.prototype.src = vinylFS.src;

/*
# runtime.dest
```js
function dest(string|function folder[, object opt])
```
Same as [vinylFs.dest][m-vinly-fs-dest]
*/
tornado.Runtime.prototype.dest = vinylFS.dest;

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
tornado.Runtime.prototype.watch = function(glob, opt, fn){
  var cb = util.type(opt).function || util.type(fn).function;
  var o = (!cb && util.type(fn).plainObject)
    || (opt && util.type(opt).plainObject)
    || {tasks: cb ? opt : fn, wait: true};

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

tornado.Runtime.prototype.task = function(name, dep, handle){
  var task = this.get(name, {ref:true});
  if(task !== this.store && task.handle){ return task.handle; }
  var handleType = util.type(handle || dep);

  if(typeof name !== 'string'){
    throw new util.PluginError({
      plugin: 'gulp-runtime',
      message: 'task(name, handle). Tasks require a string `name`'
    });
  } else if(!handleType.match(/function|array/)){
    throw new util.PluginError({
      plugin: 'gulp-runtime',
      message: 'task(name, [deps, handle]).' +
      'New tasks need at lest 2 arguments\n'+
      ' - deps: array|string of dependencies to run before this one'+
      ' - handle: function that runs the task\n'+
      '\n'
    });
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
 Now customize the Stack prototype
*/

// String to function mapping failed, handle it
//
tornado.Stack.prototype.onHandleNotFound = function(next){
  var path = next.match || next.path;
  var message = 'no task found for `'+path+'`.\n'+
    'Set one with `gulp.task(\''+path+'\', [Function])`';

  if(this.runtime.repl){
    console.log('Warning:', message);
    this.log = false;
    return next();
  }

  throw new util.PluginError({
    plugin: 'gulp-runtime',
    message: message
  });
};

// Errors anywhere in the stack
//
tornado.Stack.prototype.onHandleError = function(error, next){
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
  next();
};

// Make a logger that looks like gulp's
//
tornado.Stack.prototype.onHandle = function(next){
  if(next.error || !this.log || /^-/.test(next.match)){
    return ; // skip logging for errors, log or flags
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

// modify the repl to have some commands by default
//

function create(name, o){
  o = util.type(o || name).plainObject || {};
  var app = tornado.create(name, o);

  // have we been here already?
  if(app.repl){ return app; }
  if(app.store.children['--silent'] && !o.repl && !o.input){
    return app;
  }

  /**
   * Provide CLI commands
   */

  // --no-color
  //
  app.set('--silent', function(next){
    if(process.argv.indexOf('--tasks-simple') < 0){
      app.store.log = !this.log;
    }
    console.log('logging %s', app.store.log ? 'enabled' : 'disabled');
    next();
  });

  // --no-color, --color
  //
  app.set(':flag(--no-color|--color)', function(next){
    var wrote = false;
    if(util.color.enabled && this.params.flag === '--no-color'){
      util.color.enabled = false;
    } else if(!util.color.enabled && this.params.flag === '--color'){
      util.color.enabled = true;
    } else if(this.log){
      util.log('color already %s',
        util.color.enabled ? 'enabled' : 'disabled'
      );
      wrote = true;
    }

    if(!this.log || wrote){ return next(); }
    util.log('color %s', util.color.enabled
      ? util.color.bold('enabled') : 'disabled'
    );
    next();
  });

  // --cwd
  //
  app.set('--cwd :dirname([^ ]+)', function(next){
    var cwd = process.cwd();
    var dirname = path.resolve(cwd, next.params.dirname);
    if(dirname !== cwd){
      process.chdir(dirname);
      util.log('Working directory changed to',
        util.color.file(dirname)
      );
    }
    next();
  });

  // --tasks, -T or --tasks-simple
  //
  app.set(':flag(--tasks-simple|--tasks|-T)', function (next){
    if(!util.logTasks){ util.lazy('tasks-flags'); }
    if(next.params.flag === '--tasks-simple'){
      util.logTasksSimple(this.runtime);
    } else {
      util.logTasks(this.runtime);
    }
    next();
  });

  /*
   --require, --gulpfile is the same but changing the cwd
   */
  app.set(':flag(--require|--gulpfile) :file', function (next){

    var cwd = process.cwd();
    var file = path.resolve(cwd, next.params.file);
    var cached = Boolean(require.cache[file]);
    var isGulpfile = /--gulpfile/.test(this.queue);
    if(cached){
      delete require.cache[file];
    }

    try {
      require(file);
    } catch(err){
      var message = 'Could not load ' +
        (isGulpfile ? 'gulpfile' : 'module') + ' ' +
        util.color.file(file);

      if(this.runtime.repl){
        util.log(message);
        util.log(err.stack);
        return next();
      } else {
        throw new Error(message);
      }
    }

    util.log(
      (cached ? 'Reloaded' : 'Loaded'),
      util.color.file(file)
    );

    var dirname = path.dirname(file);
    if(isGulpfile && dirname !== cwd){
      process.chdir(dirname);
      util.log('Working directory changed to',
        util.color.file(dirname)
      );
    }

    next();
  });

  if(o.repl || util.type(o.input).stream){
    app = tornado.repl(name, o);
  }

  return app;
}

exports = module.exports = {
  create: create
};
