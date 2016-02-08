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

    this.log = this.log === void 0 || this.log;
    this.tasks = new Parth();

    if(this.repl){
      util.createREPL(this);
    }
  }
});

/**
 * gulp.task
 **/
Gulp.prototype.task = function(name, tasks, handle){
  handle = util.type(handle || tasks || name).function || false;
  tasks = util.type(tasks).array || util.type(name).array;
  name = (util.type(name).string || util.type(handle.name).string || '').trim();

  if(name && !handle){
    return (this.tasks.get(name) || {fn: null}).fn;
  } else if(name && name !== handle.name){
    handle.displayName = name;
  }

  if(name && tasks && handle){
    tasks = tasks.concat(handle, {wait: true});
    var composed = this.stack.apply(this, tasks);
    this.tasks.set(name, {fn: composed});
  } else if(name && handle){
    this.tasks.set(name, {fn: handle});
  } else if(!name && handle){
    throw new TypeError('no task name, give a named function');
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
    tasks = tasks.concat({wait: true});
    var composer = this.stack.apply(this, tasks);
    var fsWatcher = vinylFS.watch(glob, function(/* arguments */){
      composer.apply(null, [].slice.call(arguments).concat(fn));
    });
  }

  fsWatcher = vinylFS.watch(glob, opt, fn);

  if(this.repl){
    var self = this;
    this.watching = (this.watching || 0) + 1;
    fsWatcher.once('end', function(){
      --self.watching;
    });
  }

  return fsWatcher;
};

/**
 maps all the arguments of gulp.stack to functions
**/
Gulp.prototype.reduceStack = function(stack, site){
  var task = typeof site === 'function'
    ? {fn: site}
    : this.tasks.get(site);

  if(task){ stack.push(task); } else {
    throw new Error(site + ' is not defined yet');
  }

  if(!this.log || task.label){ return; }

  if(task.fn.stack instanceof Runtime.Stack){
    task.mode = task.fn.stack.wait ? 'series' : 'parallel';
    task.label = task.fn.stack.tree().label;
    task.label = task.mode + util.color.stack('(' + task.label + ')');
  } else {
    task.label = util.color.task(task.fn.displayName || task.fn.name);
  }
};


/**
 logging
**/
Gulp.prototype.onHandle = function(task, stack){
  if(!this.log){ return; }

  var deep = stack.length > 1;

  if(deep && !stack.time){
    stack.mode = util.color.mode(stack.wait ? 'series' : 'parallel');
    stack.label = util.color.stack(stack.tree().label);
    util.log('Started %s(%s)', stack.mode, stack.label);
    stack.time = process.hrtime();
  }

  if(!task.time){
    task.time = process.hrtime();
    return;
  }

  var time = util.color.time(task.time);

  util.log('%s after %s',
    (deep ? ' ' : '') + task.label,
    time
  );

  if(deep && stack.end && !stack.host){
    util.log('Finished %s(%s) after %s',
      stack.mode,
      stack.label,
      util.color.time(stack.time)
    );
  }

  if(!this.repl || this.watching){ return; }
  if(!stack.host && stack.end){ this.repl.prompt(); }
};

/**
 error handling
**/
Gulp.prototype.onHandleError = function(err, site, stack){

  util.log('%s in %s',
    util.color.error('error'),
    util.color.stack(stack.label || stack.tree().label),
    this.repl ? '\n' + err.stack : ''
  );

  console.log('- %s failed after %s',
    util.color.error(site.label),
    util.color.time(site.time)
  );

  site.error = err;
  if(!this.repl){ throw err; }
};

/**
  Now, some sugar on top
**/

Gulp.prototype.start = function(/* arguments */){
  var tasks = arguments.length ? arguments : ['default'];
  return this.stack.apply(this, tasks)();
};

Gulp.prototype.series = function(/* arguments */){
  var args = [].slice.call(arguments);
  var props = util.type(args[args.length - 1]).plainObject && args.pop() || {};
  var tasks = args.concat(util.merge(props, {wait: true}));
  return this.stack.apply(this, tasks);
};

Gulp.prototype.parallel = function(/* arguments */){
  var args = [].slice.call(arguments);
  var props = util.type(args[args.length - 1]).plainObject && args.pop() || {};
  var tasks = args.concat(util.merge(props, {wait: false}));
  return this.stack.apply(this, tasks);
};
