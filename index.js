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
     'Try:\n `npm install gulp`'
  });
}

/*
 Give a task method like gulp does
*/

runtime.Runtime.prototype.task = function(name, handle){
  if(typeof name !== 'string'){
    throw new util.PluginError({
      plugin: 'gulp-runtime',
      message: 'task(name, handle). Tasks require a string `name`'
    });
  } else if(typeof handle !== 'function'){
    throw new util.PluginError({
      name: 'gulp-runtime',
      message: 'task(name, handle). Tasks need a function `handle`'
    });
  }

  this.set(name, handle);
};

/*
 For errors anywhere in the stack
*/

runtime.Stack.prototype.onHandleError = function(error, next){
  if(error.plugin){
    util.log('gulp-runtime');
    util.log('Error found in plugin %s', error.plugin);
  }

  if(!this.repl){ throw error; }
  util.log(error.stack);
  next();
};

/*
 For not found tasks
*/

runtime.Stack.prototype.onHandleNotFound = function(next){
  var path = next.match || next.path;
  var message = 'no function found for task `'+path+'`.\n'+
    'Set one with `task('+ (path ? '\'' + path + '\', ' : path) +
    '[Function])` or give a function to the stack method';

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
    util.log('Started `%s` in %s %s',
    '\'' + util.colors.cyan(this.path) + '\'',
      util.colors.blue(mode),
      host ? 'from ' + util.colors.green(host) : ''
    );
    this.time = util.hrtime();
  } else {
    time = next.time ? 'in ' + util.prettyTime(process.hrtime(next.time)) : '';
    util.log('- %s `%s` %s',
      status,
      '\'' + util.colors.cyan(path) + '\'',
      util.colors.magenta(time)
    );
  }

  if(!next.time){
    next.time = util.hrtime();
  }

  var self = this;
  while(self && !self.queue){
    time = util.prettyTime(process.hrtime(self.time));
    util.log('Stack `%s` taked %s',
      '\'' + util.colors.cyan(self.path) + '\'',
      util.colors.magenta(time)
    );
    self = self.host;
  }

  if(this.repl && !self){
    this.repl.prompt();
  }
};

exports = module.exports = runtime.create();
