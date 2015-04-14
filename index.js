'use strict';

var path = require('path');
var util = require('./lib/util');
var tornado = require('./lib/proto');

// export instances with the CLI built-in
//
// Notes:
//  - app -> [tornado][m-tornado] instance
//
// [m-tornado]: (https://github.com/stringparser/tornado)
//
function create(name, o){
  var app = tornado.create(name, o);
  var children = app.store.children;

  o = util.type(o || name).plainObject || {};
  if(app.repl || (children['--silent'] && !o.repl && !o.input)){
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
