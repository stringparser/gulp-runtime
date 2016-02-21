'use strict';

var util = require('./lib/util');

var repl = require('gulp-repl');
var Parth = require('parth');
var Runtime = require('runtime');
var vinylFS = require('vinyl-fs');

var Gulp = module.exports = Runtime.createClass({
  src: vinylFS.src,
  dest: vinylFS.dest,
  create: function Gulp(props){
    Gulp.super_.call(this, props);

    this.log = this.log === void 0 || this.log;
    this.tasks = new Parth();

    this.repl = this.repl && repl(this) || {emit: function(){}};
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
    return vinylFS.watch(glob, function(/* arguments */){
      composer.apply(null, [].slice.call(arguments).concat(fn));
    });
  }

  return vinylFS.watch(glob, opt, fn);
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

  var label;
  if(task.fn.stack instanceof Runtime.Stack){
    label = task.fn.stack.tree().label;
    task.mode = task.fn.stack.wait ? 'series' : 'parallel';
    task.label = task.mode + util.color.stack('(' + label + ')');
  } else {
    label = task.fn.displayName || task.fn.name;
    task.label = util.color.task(label);
  }

  task.match = task.match || label;
};


/**
 logging
**/
Gulp.prototype.onHandle = function(task, stack){
  if(!this.log){ return; }

  var deep = stack.length > 1;

  if(deep && !stack.time){
    stack.time = process.hrtime();
    stack.mode = util.color.mode(stack.wait ? 'series' : 'parallel');
    stack.label = util.color.stack(stack.tree().label);
    util.log('Started %s(%s)', stack.mode, stack.label);
  }

  if(!task.time){
    task.time = process.hrtime();
    this.repl.emit('task:start', {name: task.match});
    return;
  }

  if(task.fn.stack instanceof Runtime.Stack){
    this.repl.emit('task:ended', {name: task.match});
  } else {
    var time = util.color.time(task.time);
    var space = (deep ? ' ' : '');

    util.log('%s ended in %s', space + task.label, time);
    this.repl.emit('task:ended', {name: task.match});
  }

  if(deep && stack.time && stack.end){
    util.log('%s took %s(%s)',
      util.color.time(stack.time),
      stack.mode,
      stack.label
    );
  }
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

  if(!this.repl){ throw err; }
};

/**
  With some sugar on top please
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
