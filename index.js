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
    this.emit = function(){};
    this.tasks = new Parth();

    if(this.repl){
      this.repl = repl(this);
      this.emit = this.repl.emit.bind(this.repl);
    }

    if(this.log){
      var replStatus = this.repl ? 'active' : 'inactive';
      util.log('REPL is %s', util.chalk.bold(replStatus));
      var file = new Error().stack.match(/\(([^:]+)/g) || {2: ''};
      file = util.chalk.magenta(util.tildify(file[2].slice(1)));
      util.log('Using', file);
    }
  }
});

/**
 * gulp.task
**/

Gulp.prototype.task = function(name, deps, handle){
  handle = util.type(handle || deps || name).function;
  deps = util.type(deps).array || util.type(name).array;
  name = (util.type(name).string || util.type(handle.name).string || '').trim();

  if(name && !deps && !handle){
    return this.tasks.get(name).fn || null;
  }

  handle = handle || function(next){ next(); };
  if(name && handle && name !== handle.name){
    handle.displayName = name;
  }

  if(name && deps){
    deps = deps.concat(handle, {wait: true});
    var composed = this.stack.apply(this, deps);
    this.tasks.set(name, {name: name, fn: composed});
  } else if(name){
    this.tasks.set(name, {name: name, fn: handle});
  } else if(!name){
    throw new TypeError('no task name, kgive a named function');
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
    fn = fn || function onStackEnd(){ }
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
    task.label = task.mode + '(' + label + ')';
  } else {
    label = task.fn.displayName || task.fn.name;
    task.label = util.color.task(label);
  }
};


/**
 logging
**/
Gulp.prototype.onHandle = function(task, stack){
  if(!this.log){ return; }

  var deep = stack.length > 1;

  if(deep && !stack.time){
    stack.time = process.hrtime();
    stack.mode = stack.wait ? 'series' : 'parallel';
    stack.tree = stack.tree();
    util.log('Started %s(%s)',
      util.chalk.bold(stack.mode),
      stack.tree.label
    );
  } else if(!stack.time && !stack.end){
    util.log('Starting %s', task.label);
  }

  if(!task.time){
    task.time = process.hrtime();
    this.emit('task:start', {name: task.match});
    return;
  }

  if(task.fn.stack instanceof Runtime.Stack){
    this.emit('task:ended', {name: task.match});
  } else {
    var time = util.color.time(task.time);

    util.log('%s %s %s',
      (deep ? ' ' : '') + task.label,
      deep ? 'took' : 'ended after',
      time
    );
    this.emit('task:ended', {name: task.match});
  }

  if(deep && stack.time && stack.end){
    util.log('Ended %s(%s) after %s',
      util.chalk.bold(stack.mode),
      stack.tree.label,
      util.color.time(stack.time)
    );
  } else if(this.repl && !deep && stack.end){
    this.repl.prompt();
  }
};

/**
 error handling
**/
Gulp.prototype.onHandleError = function(err, site, stack){

  util.log('%s in %s',
    util.color.error('error'),
    stack.tree ? stack.tree.label : stack.tree().label,
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
