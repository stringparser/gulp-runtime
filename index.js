'use strict';

var util = require('./lib/util');

var Parth = require('parth');
var Runtime = require('runtime');
var vinylFS = require('vinyl-fs');

var Gulp = module.exports = Runtime.createClass({
  src: vinylFS.src,
  dest: vinylFS.dest,
  create: function(props, Super){
    props = props || {};
    Super.apply(this, props);
    this.tasks = new Parth();
    this.watchers = {};

    if(this.repl === true){
      util.createREPL(this);
    }
  }
});

/**
 * gulp.task
 **/
Gulp.prototype.task = function(name, tasks, fn){
  fn = util.type(fn || tasks).function || '';
  name = util.type(name || fn.displayName || fn.name).string;
  tasks = util.type(tasks).array || util.type(name).array;

  if(name && tasks && fn){
    var handle = this.stack.apply(this, tasks.concat(fn, {wait: true}));
    this.tasks.set(name, {handle: handle});
  } else if(name && fn){
    fn.displayName = name;
    this.tasks.set(name, {handle: fn});
  } else if(name){
    return this.tasks.get(name);
  } else if(!name){
    throw new TypeError('cannot get a task without a name');
  } else if(!fn){
    throw new TypeError('cannot set a task without a function');
  }

  return this;
};

/**
 * gulp.dest
 **/
Gulp.prototype.watch = function(glob, opt, fn) {
  var self = this, watcher;

  if (typeof opt === 'function' || Array.isArray(opt)) {
    fn = opt;
    opt = null;
  }

  // Array of tasks given
  if (Array.isArray(fn)) {
    watcher = vinylFS.watch(glob, opt, function() {
      self.stack.apply(self, fn)();
    });
  } else {
    watcher = vinylFS.watch(glob, opt, fn);
  }

  this.watchers[glob] = watcher;
  watcher.once('end', function(){
    self.watchers[glob] = null;
  });

  return watcher;
};

Gulp.prototype.reduceStack = function(stack, site){
  var task = typeof site !== 'function'
    ? this.tasks.get(site)
    : {path: site.displayName || site.name, handle: site};

  if(!task || typeof task.handle !== 'function'){
    throw new Error('no task handle defined for `' + site + '`');
  } else if(this.log){
    if(!stack.label){ stack.label = []; }
    stack.push(task.handle);
    stack.label.push(task);
  } else {
    stack.push(task.handle);
  }

  return stack;
};

Gulp.prototype.onHandle = function(next, task, stack){
  if(!this.log || /^-/.test(task.path)){
    return; // ^ skip logging for errors, silent or flags
  } else if(stack.host && !stack.host.path){
    var host = stack.host.path = stack.host.tree().label;
  } else {
    host = stack.host && stack.host.path || '';
  }

  if(!stack.time){
    stack.path = stack.tree().label;
    util.log('%sStarted \'%s\' in %s',
      host, util.color.cyan(stack.path)
    );
    stack.time = process.hrtime();
  } else if(next.time && task.path !== stack.path){
    util.log('%sFinished \'%s\' after %s',
      host,
      util.color.cyan(task.path),
      util.color.time(next.time)
    );
  }

  if(!next.time){ next.time = process.hrtime(); }

  stack.time.end = util.color.time(stack.time);
  util.log('%sFinished \'%s\' after %s',
    host, util.color.cyan(stack.path), stack.time.end
  );
};
