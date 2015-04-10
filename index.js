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
function watch(string|array globs[, array opt, function callback])
```
Same as [gulp.watch][m-gulp-watch]
*/
tornado.Runtime.prototype.watch = function(glob, opt, cb){
  if(util.type(opt).match(/function|array/)){
    cb = opt;
    opt = null;
  }

  if(util.type(cb).array){
    return vinylFS.watch(glob, opt,
      this.stack(cb.join(' '))
    );
  }

  return vinylFS.watch(glob, opt, cb);
};

/*
# runtime.stalk
```js
function stalk(string|array globs[, array opt, function callback])
```
Same as [runtime.watch][t-runtime-watch] but files are
 reloaded on the `require.cache` as they change. A callback is
  provided if further processing is needed.

_arguments_
 - same as [runtime.watch][t-runtime-watch] aside of `callback`
 - `callback` type function that will be called after file is reloaded

_returns_
 - a watcher, same as [runtime.watch][t-runtime-watch]

> Notes:
- The arguments of the callback are the same as
 [runtime.watch][t-runtime-watch] (a gaze event)
- When a file is deleted the reload will be skipped but the
callback is still invoked

*/
tornado.Runtime.prototype.stalk = function(glob, opt, cb){
  var self = this;
  cb = typeof cb === 'function' && cb;
  return this.watch(glob, opt, function(ev){
    if(ev.type === 'delete'){
      return cb ? cb(ev) : null;
    }

    delete require.cache[ev.path];
    require(ev.path);

    if(self.store.log){
      console.log('Reloaded', util.color.file(ev.path));
    }

    if(cb){ cb(ev); }
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
    return this.set(name, handle);
  } else if(!handle.name && !handle.displayName){
    handle.displayName = name;
  }

  this.set(name, {
    dep: dep,
    handle: this.stack(dep.join(' '), handle, {wait: true})
  });
};

/*
 Now we customize the Stack prototype
*/

// Errors anywhere in the stack
//
tornado.Stack.prototype.onHandleError = function(error, next){

  util.log(
    '\'' + util.color.cyan(next.match) + '\'',
    'has thrown an error'
  );

  if(!this.runtime.repl || !this.runtime.store.log){
    throw error;
  }
  util.log(error.stack);
};

// String to function mapping failed, handle it
//
tornado.Stack.prototype.onHandleNotFound = function(next){
  var path = next.match || next.path;
  var message = 'no task found for `'+path+'`.\n'+
    'Set one with `task(\''+path+'\', [Function])`';

  if(this.runtime.repl){
    console.log('Warning:', message);
    return next();
  }

  throw new util.PluginError({
    plugin: 'gulp-runtime',
    message: message
  });
};


// Make a logger that looks like gulp's
//
tornado.Stack.prototype.onHandle = function(next){
  if(!this.runtime.store.log || /^-/.test(next.match)){
    return ; // skip if logging disabled or a flag
  }

  var len = this.argv.length > 1;
  var path = next.match || next.path;
  var host = this.host ? this.host.path : '';
  var mode = this.wait ? 'series' : 'parallel';
  var time, status = next.time ? 'Finished' : 'Wait for';

  if(!this.time && len){
    util.log('Started', '\'' + util.color.cyan(this.path) + '\'',
      host ? ('from ' + util.color.green(host)) : 'in',
      util.color.bold(mode)
    );
  } else if(next.time){
    time = util.prettyTime(process.hrtime(next.time));
    util.log((len ? '- ' : '') + status,
      '\'' + util.color.cyan(path) + '\'' +
      (time ? ' in ' + util.color.magenta(time) : '')
    );
  }

  if(!this.time){ this.time = process.hrtime(); }
  if(!next.time){ next.time = process.hrtime(); }
  if(this.queue || this.time.end){ return ; }

  this.time.end = util.prettyTime(process.hrtime(this.time));
  util.log('Finished', '\'' + util.color.cyan(this.path) + '\'',
    (host ? 'from '+ util.color.green(host) + ' ' : '') +
    'in ' +  util.color.magenta(this.time.end)
  );
};

// modify the repl to have some commands by default
//
var createREPL = tornado.repl;

tornado.repl = function (name, o){
  var app = createREPL(name, o);
  if(app.store.children['--silent']){ return app; }
  // we have been here already ^

  // --silent
  //
  app.set('--silent', function(next){
    var silent = app.store.silent;
    if(silent){ util.log('logging enabled'); }

    if(process.argv.indexOf('--tasks-simple') > 0){
      silent = true;
    } else {
      silent = !silent;
    }
    app.store.silent = silent;
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

      if(this.repl){
        util.log(message); util.log(err.stack);
        return next();
      } else {
        throw new util.PluginError({
          plugin: util.color.yellow('gulp-runtime'),
          message: message
        });
      }
    }

    util.log(
      (cached ? util.color.cyan('Reloaded') : 'Loaded'),
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
