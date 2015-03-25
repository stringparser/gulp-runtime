'use strict';

var util = require('./lib/util');
var runtime = require('runtime');

/*
 ¿Do we have gulp installed?
*/

try { require('gulp'); }
catch(err){
  throw new util.PluginError({
    plugin: 'gulp-runtime',
    message: 'gulp is not installed locally.'+
     'Try:\n    `npm install gulp`'
  });
}

/*
 Give a task method that behaves like gulp does
*/

runtime.Runtime.prototype.task = function(name, dep, handle){
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
      ' - deps: array of task dependencies to run before this one'
    });
  }

  var depsType = util.type(dep);
  var handleType = util.type(handle);

  handle = handleType.function || depsType.function
   || function(next){ next(); };

  if(!depsType.array){
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
 For errors anywhere in the stack
*/

runtime.Stack.prototype.onHandleError = function(error, next){
  if(this.errorFound){ throw this.errorFound; }

  util.log('`' + util.color.yellow('gulp-runtime') + '`',
    'found error in', '\'' + util.color.cyan(next.match) + '\''
  );

  if(error.plugin){
    process.stdout.write('from plugin', error.plugin);
  }

  this.errorFound = error;

  if(!this.repl){ throw error; }
  util.log(error.stack);
  next();
};

/*
 For not found tasks
*/

runtime.Stack.prototype.onHandleNotFound = function(next){
  var path = next.match || next.path;
  var message = 'no task found for `'+path+'`.\n'+
    'Set one with `task(' +
    (path ? '\'' + path + '\', ' : path) + '[Function])`';

  if(!this.repl){ throw new Error(message); }
  this.repl.input.write('Warning: '+message+'\n');
  this.repl.prompt();
};


/*
 Make a logger that looks like gulp's
*/

runtime.Stack.prototype.onHandle = function(next){
  var path = next.match || next.path;
  var host = this.host ? this.host.path : '';
  var mode = this.wait ? 'series' : 'parallel';
  var time, status = next.time ? 'Finished' : 'Wait for';

  if(!this.time){
    util.log('Started',
      '\'' + util.color.cyan(this.path) + '\'',
      'in',
      util.color.bold(mode),
      host ? 'from ' + util.color.green(host) : ''
    );
    this.time = util.hrtime();
  } else if(next.time && this.argv.length > 1){

    time = util.prettyTime(process.hrtime(next.time));

    util.log('-', status,
      '\'' + util.color.cyan(path) + '\'',
      'in ' + util.color.magenta(time)
    );
  }

  if(!next.time){
    next.time = util.hrtime();
  }

  var self = this;
  while(self && !self.queue){
    time = util.prettyTime(process.hrtime(self.time));
    util.log('Finished', '\'' + util.color.cyan(self.path) + '\'',
      host ? 'from '+util.color.green(host) : '' +
      'in', util.color.magenta(time)
    );
    self = self.host;
  }

  if(this.repl && self && !self.queue){
    this.repl.prompt();
  }
};

exports = module.exports = runtime.create();
