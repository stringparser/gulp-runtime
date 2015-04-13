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

Same as [gulp.watch][m-gulp-watch] (run tasks after change with an optional
 callback) with some aditional features:
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

**/
tornado.Runtime.prototype.watch = function(glob, opt, fn){
  var cb = util.type(opt).function || util.type(fn).function;
  var o = (!cb && util.type(fn).plainObject)
    || (opt && util.type(opt).plainObject)
    || {tasks: cb ? opt : null, wait: true};

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

  return vinylFS.watch(glob, opt, reload || function onChange(ev){
    if(cb){ cb(ev, o); }
  });
};

/*
# runtime.task
```js
function task(string name[, array deps, function handle])
```
Same as [gulp.task][m-gulp-task]

*/

tornado.Runtime.prototype.task = function(name, dep, handle){
  if(typeof name !== 'string'){
    throw new util.PluginError({
      plugin: 'gulp-runtime',
      message: 'task(name, handle). Tasks require a string `name`'
    });
  } else if(arguments.length < 2){
    throw new util.PluginError({
      plugin: 'gulp-runtime',
      message: 'task(name, [deps, handle]).' +
      'Tasks need at least one more argument\n'+
      ' - handle: function for the task\n'+
      ' - deps: array of task dependencies to run before this one'+
      '\n'
    });
  }

  var depType = util.type(dep);
  var handleType = util.type(handle);

  handle = handleType.function || depType.function
   || function(next){ next(); };

  if(!depType.array || !dep.length){
    this.set(name, handle);
    return handle;
  } else if(!handle.name && !handle.displayName){
    handle.displayName = name;
  }

  var tick = this.stack(dep.join(' '), handle, {wait: true});
  this.set(name, {dep: dep, handle: tick});
  return tick;
};

/*
 Now we customize the Stack prototype
*/

// String to function mapping failed, handle it
//
tornado.Stack.prototype.onHandleNotFound = function(next){
  var path = next.match || next.path;
  var message = 'no task found for `'+path+'`.\n'+
    'Set one with `task(\''+path+'\', [Function])`';

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
  var file = error.stack.match(/\(?(\S+:\d+:\d+)\)?/);
  file = path.resolve(process.cwd(), file[1] || file[2]);

  util.log('Error in \'%s\' after %s',
    util.color.cyan(next.match),
    util.color.time(next.time)
  );

  util.log('  at  %s', util.color.file(file));

  if(!this.runtime.repl){ throw error; }
  this.log(error.stack);
  next.error = error;
  next();
};

// Make a logger that looks like gulp's
//
tornado.Stack.prototype.onHandle = function(next){
  if(next.error || !this.log || /^-/.test(next.match)){
    return ; // skip logging for errors, log or flags
  }

  var len = this.path.split(/[ ]+/).length > 1;
  var path = next.match || next.path;
  var host = this.host ? this.host.path : '';
  var mode = this.wait ? 'series' : 'parallel';
  var time, status = next.time ? 'Finished' : 'Wait for';
  var indent = len && mode === 'parallel' ? '- ' : '';

  if(!this.time && len){
    util.log('Started \'%s\'', util.color.cyan(this.path),
      host ? ('from ' + util.color.green(host)) : 'in',
      util.color.bold(mode)
    );
  } else if(next.time){
    util.log('%s \'%s\' %s', indent + status, util.color.cyan(path),
      (time ? ' in ' + util.color.time(time) : '')
    );
  }

  if(!this.time){ this.time = process.hrtime(); }
  if(!next.time){ next.time = process.hrtime(); }
  if(this.queue || this.time.end){ return ; }

  this.time.end = util.color.time(this.time);
  util.log('Finished \'%s\'%s in %s', util.color.cyan(this.path),
    (host ? ' from '+ util.color.green(host) + ' ' : ''),
    this.time.end
  );
};

// modify the repl to have some commands by default
//
var createREPL = tornado.repl;

tornado.repl = function (name, o){
  var app = createREPL(name, o);
  if(app.store.children['--silent']){ return app; }
  // we have been here already ^

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
  app.set(':flag(--require|--gulpfile) :filename', function (next){

    var cwd = process.cwd();
    var filename = next.params.filename;
    filename = path.resolve(cwd, filename);
    var cached = Boolean(require.cache[filename]);
    var isGulpfile = /--gulpfile/.test(this.queue);
    if(cached){ delete require.cache[filename]; }

    try {
      require(filename);
    } catch(err){
      var message = 'Could not load ' +
        (isGulpfile ? 'gulpfile' : 'module') + ' ' +
        util.color.file(filename);

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
      util.color.file(filename)
    );

    var dirname = path.dirname(filename);
    if(isGulpfile && dirname !== cwd){
      process.chdir(dirname);
      util.log('Working directory changed to',
        util.color.file(dirname)
      );
    }

    next();
  });

  return app;
};

exports = module.exports = {
  repl: tornado.repl,
  create: tornado.create
};
