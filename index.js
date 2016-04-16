'use strict';

var Parth = require('parth');
var Runtime = require('runtime');
var vinylFS = require('vinyl-fs')

var util = require('./lib/util');
var __slice = Array.prototype.slice;
var fromGulpBin = /gulp$/.test(process.argv[1]);
var taskSimpleFlag = process.argv.indexOf('--tasks-simple') > -1;

var Gulp = module.exports = Runtime.createClass({
  src: vinylFS.src,
  dest: vinylFS.dest,
  create: function Gulp(props){
    Gulp.super_.call(this, props);
    this.tasks = new Parth();

    this.log = this.log === void 0 || this.log;
    if(this.repl && taskSimpleFlag){ this.repl = false; }
    this.gulpfile = util.getGulpFile();

    // when the gulpfile is passed as argument default to process.argv
    if(!this.argv && (process.argv[1] === this.gulpfile || fromGulpBin)){
      this.argv = process.argv.slice(2);
    } else {
      this.argv = util.type(this.argv).array;
    }

    if(this.repl){
      util.log('REPL', util.format.enabled('enabled'));
      this.repl = require('gulp-repl')(this);
    }

    if(this.log && !fromGulpBin){
      util.log('Using gulpfile ' + util.format.path(this.gulpfile));
    }
    // add cli tasks and run the cli for this instance
    require('./lib/cli')(this, this.argv);
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
    this.tasks.set(name, {label: name, fn: composed});
  } else if(name){
    this.tasks.set(name, {label: name, fn: handle});
  } else if(!name){
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
    fn = fn || function onStackEnd(){ }
    var composer = this.stack.apply(this, tasks);
    return vinylFS.watch(glob, function(/* arguments */){
      composer.apply(null, __slice.call(arguments).concat(fn));
    });
  }

  return vinylFS.watch(glob, opt, fn);
};

/**
 maps all the arguments of gulp.stack to functions
**/
Gulp.prototype.reduceStack = function(stack, site){
  var task = typeof site === 'function'
    ? {fn: site, label: site.displayName || site.name || 'anonymous'}
    : this.tasks.get(site);

  if(task){
    stack.push(task);
  } else if(typeof site === 'string'){

    util.log('Task `%s` is %s',
      util.format.task(site),
      util.format.error('not defined yet')
    );

    util.log('Not sure how to do that? See: %s',
      util.format.link(util.docs.task)
    );

    throw new Error('task not defined yet');
  }
};


/**
 logging
**/
Gulp.prototype.onHandle = function(task, stack){
  if(!this.log || (task.params && task.params.cli)){
    return;
  }

  var deep = stack.length > 1;

  if(deep && !stack.time){
    stack.time = process.hrtime();
    stack.mode = stack.wait ? 'series' : 'parallel';
    stack.tree = stack.tree();
    util.log('Started %s(%s)',
      util.format.mode(stack.mode),
      util.format.task(stack.tree.label)
    );
  } else if(!stack.time && !stack.end){
    util.log('Starting %s', util.format.task(task.label));
  }

  if(!task.time){
    task.time = process.hrtime();
    return;
  }

  if(!(task.fn.stack instanceof Runtime.Stack)){
    var time = util.format.time(task.time);
    util.log('%s %s %s',
      (deep ? ' ' : '') + util.format.task(task.label),
      deep ? 'took' : 'ended after',
      time
    );
  }

  if(deep && stack.time && stack.end){
    util.log('Ended %s(%s) after %s',
      util.format.mode(stack.mode),
      util.format.task(stack.tree.label),
      util.format.time(stack.time)
    );
  }

  if(!deep && stack.end && this.repl){
    this.repl.prompt();
  }
};

/**
 error handling
**/
Gulp.prototype.onHandleError = function(err, site, stack){
  util.log('%s in %s',
    util.format.error('error'),
    stack.tree ? stack.tree.label : stack.tree().label,
    this.repl ? '\n' + err.stack : ''
  );

  console.log('- %s failed after %s',
    util.format.error(site.label),
    util.format.time(site.time)
  );

  if(!this.repl){ throw err; }
};

/**
  With some sugar on top please
**/

Gulp.prototype.start = function(/* arguments */){
  this.stack.apply(this, arguments.length ? arguments : ['default'])();
  return this;
};

Gulp.prototype.series = function(/* arguments */){
  var args = __slice.call(arguments);
  var props = util.type(args[args.length - 1]).plainObject && args.pop() || {};
  var tasks = args.concat(util.merge(props, {wait: false}));
  return this.stack.apply(this, tasks);
};

Gulp.prototype.parallel = function(/* arguments */){
  var args = __slice.call(arguments);
  var props = util.type(args[args.length - 1]).plainObject && args.pop() || {};
  var tasks = args.concat(util.merge(props, {wait: false}));
  return this.stack.apply(this, tasks);
};
