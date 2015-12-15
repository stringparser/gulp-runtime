'use strict';

var util = require('./lib/util');

var Parth = require('parth');
var Runtime = require('runtime');
var vinylFS = require('vinyl-fs');

var Gulp = module.exports = Runtime.createClass({
  src: vinylFS.src,
  dest: vinylFS.dest,
  create: function(props, Super){
    Super.call(this, props);
    this.tasks = new Parth();

    if(this.repl){
      this.log = true;
      util.createREPL(this);
    } else if(this.log === void 0){
      this.log = true;
    }
  }
});

/**
 * gulp.task
 **/
Gulp.prototype.task = function(name, tasks, fn){
  fn = util.type(fn || tasks || name).function || '';
  tasks = util.type(tasks).array || util.type(name).array;
  name = util.type(name).string || util.type(fn.displayName || fn.name).string;

  if(name){ name = name.trim(); }
  if(name && fn && (!fn.name || !fn.displayName)){
    fn.displayName = name;
  }

  if(name && tasks && fn){
    var handle = this.stack.apply(this, tasks.concat(fn, {wait: true}));
    this.tasks.set(name, {handle: handle});
  } else if(name && fn){
    this.tasks.set(name, {handle: fn});
  } else if(!name && fn){
    throw new TypeError('no name given: we need a named function');
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
    throw new Error('task `' + site + '` is not defined yet');
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

  var task = stack.labels[stack.indexOf(site)];
  var depth = stack.length > 1;

  if(!stack.time){
    stack.time = process.hrtime();
    stack.label = stack.tree().label;
    if(depth){
      util.log('Calling %s',
        util.color.stack(stack.label)
      );
    }
  } else if(!(task.handle.stack instanceof this.Stack)){
    console.log('%s %s%s',
      next.time ? '+ ended' : '- start',
      util.color.task(task.path),
      next.time ? ' after ' + util.color.time(next.time) : ''
    );
  } else if(!depth && !next.time){
    console.log('/ now %s', util.color.task(task.path));
  }

  if(!next.time){ next.time = process.hrtime(); }
  if(!stack.end){ return; }

  if(depth){
    util.log('%s took %s',
      util.color.stack(stack.label),
      util.color.time(stack.time)
    );
  }

  if(!this.repl){ return; }
  var host = stack.host || stack;
  while(host && host.end){
    if(!host.host){ this.repl.prompt(); }
    host = host.host;
  }
};

/**
 error handling
**/
Gulp.prototype.onHandleError = function(err, next, site, stack){
  var task = stack.labels[stack.indexOf(site)];

  util.log('%s in %s',
    util.color.red('error'),
    util.color.stack(stack.label || stack.tree().label),
    this.repl ? '\n' + err.stack : ''
  );

  console.log('- %s failed after %s',
    util.color.red(task.path),
    util.color.time(next.time)
  );

  next.error = err;
  if(!this.repl){ throw err; }
};
