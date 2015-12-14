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
    Super.call(this, props);
    this.tasks = new Parth();

    if(this.repl === true){
      this.log = true;
      util.createREPL(this);
    } else {
      this.log = this.log === void 0 || this.log;
    }
  }
});

/**
 * gulp.task
 **/
Gulp.prototype.task = function(name, tasks, fn){
  fn = util.type(fn || tasks || name).function || '';
  name = util.type(name).string || util.type(fn.displayName || fn.name).string;
  tasks = util.type(tasks || name).array;

  if(name && tasks && fn){
    var handle = this.stack.apply(this, tasks.concat(fn, {wait: true}));
    this.tasks.set(name, {handle: handle});
  } else if(name && fn){
    if(!fn.name && !fn.displayName){ fn.displayName = name; }
    this.tasks.set(name, {handle: fn});
  } else if(!name && fn){
    throw new TypeError('give a named function');
  } else if(name && !fn){
    return this.tasks.get(name) || false;
  } else if(!fn){
    throw new TypeError('cannot set a task without a function');
  }

  return this;
};

/**
 * gulp.watch
 **/
Gulp.prototype.watch = function(glob, opt, handle) {
  var fn = util.type(handle || opt).function;
  var tasks = util.type(opt).array;

  if(tasks){
    var self = this;
    vinylFS.watch(glob, opt, function onChange() {
      self.stack.apply(self, tasks)();
    });
  }

  return vinylFS.watch(glob, opt, fn);
};

/**
 maps all the arguments of gulp.stack to functions
**/
Gulp.prototype.reduceStack = function(stack, site){
  var task = typeof site !== 'function'
    ? this.tasks.get(site)
    : {path: site.displayName || site.name, handle: site};

  if(!task || typeof task.handle !== 'function'){
    throw new Error('no task handle defined for `' + site + '`');
  } else if(this.log && stack instanceof this.Stack){
    if(!stack.labels){ stack.labels = []; }
    stack.push(task.handle);
    stack.labels.push(task);
  } else {
    stack.push(task.handle);
  }

  return stack;
};

/**
 logging
**/
Gulp.prototype.onHandle = function(next, site, stack){
  if(!this.log){ return; }
  // ^ skip logging for errors, silent or flags
  var task = stack.labels[stack.indexOf(site)];
  var depth = stack.length > 1;

  if(!stack.time){
    stack.time = process.hrtime();
    stack.label = stack.tree().label;
    if(depth){
      util.log('Calling %s', util.color.stack(stack.label));
    }
  }

  if(!(task.handle.stack instanceof this.Stack)){
    console.log('%s %s%s',
      next.time ? '+ ended' : '- start',
      util.color.task(task.path),
      next.time ? ' after ' + util.color.time(next.time) : ''
    );
  } else if(!depth){
    console.log('/ now %s', util.color.task(task.path));
  }

  if(!next.time){ next.time = process.hrtime(); }
  if(!stack.end){ return; }

  if(depth){
    stack.time.end = stack.time;
    util.log('%s took %s',
      util.color.stack(stack.label),
      util.color.time(stack.time.end)
    );
  }

  if(!this.repl){ return; }
  var host = stack.host || stack;
  while(host){
    if(host.end && !host.host){
      this.repl.prompt();
    }
    host = host.host;
  }
};
