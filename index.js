'use strict';

var path = require('path');
var util = require('./lib/util');
var tornado = require('./lib/proto');

/*
## documentation

#### module.exports

The `module.exports` a function

```js
var create = require('gulp-runtime');
```

#### create
```js
function create([string name|object options, object options])
```
A key value instance store. When there is no instance `name`
a new one is retrieved, if it already exists that is returned istead.

_arguments_
 - `name` type string, the name given for the instance
 - `options` type object, options passed down to the instance
  - `options.log` type boolean, whether to log or not
  - `options.repl` type boolean, whether to make a repl with the instance
  - `options.input` type stream, input stream for the repl
  - `options.output` type stream, output stream for the repl

_defaults_
 - when `options.repl` or `options.input` is truthy a repl is created
  at `instance.repl` using the [readline][m-readline] module
  - if `options.input` is not a stream, to `process.stdin`
  - if `options.output` is not a stream, to `process.stdout`

_returns_
 - an existing instance `name`
 - a new instance if there wasn't an instance `name` instantiated
 - a repl `name` if `options.repl` or `options.input` is truthy

*/
function create(name, o){
  o = util.type(o || name).plainObject || {};
  var app = tornado.create(name, o);
  if(app.repl){ return app; } // <- have we been here already?

  var repl = o.repl || o.input;
  if(app.store.children['--silent']){
    return repl ? tornado.repl(name, o) : app;
  }

  // --no-color
  //
  app.set('--silent', function(next){
    if(this.path.indexOf('--tasks-simple') < 0){
      this.log = app.store.log = !this.log;
    }
    next();
  });

  // --cwd
  //
  app.set('--cwd :dirname([^ ]+)', function(next){
    var cwd = process.cwd();
    var dirname = path.resolve(cwd, next.params.dirname);
    if(dirname !== cwd){ process.chdir(dirname); }
    if(this.log){
      util.log('Working directory changed to',
        util.color.file(dirname)
      );
    }
    next();
  });

  // --no-color, --color
  //
  app.set(':flag(--no-color|--color)', function(next){
    util.color.enabled = this.params.flag === '--color';
    if(!this.log){ return next(); }
    util.log('color %s',util.color.enabled
      ? util.color.bold('enabled')
      : 'disabled'
    );
    next();
  });

  // --tasks, -T or --tasks-simple
  //
  app.set(':flag(--tasks-simple|--tasks|-T)', function (next){
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
    if(cached){ delete require.cache[file]; }

    try {
      require(file);
    } catch(err){
      util.log('Could not load %s %s', (isGulpfile ? 'gulpfile' : 'module'),
        util.color.file(file)
      );

      if(this.runtime.repl){
        util.color.callersPath(err.stack);
        console.log(err.stack);
        return next();
      } else { throw err; }
    }

    if(this.log){
      util.log((cached ? 'Reloaded' : 'Loaded'), util.color.file(file));
    }

    var dirname = path.dirname(file);
    if(isGulpfile && dirname !== cwd){
      process.chdir(dirname);
      if(this.log){
        util.log('Working directory changed to',
          util.color.file(dirname)
        );
      }

      // update "gulpfile"
      process.argv[1] = file;
    }
    next();
  });

  return repl ? tornado.repl(name, o) : app;
}

exports = module.exports = {
  create: create
};
