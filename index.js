'use strict';

var __slice = Array.prototype.slice;

var Parth = require('parth');
var Runtime = require('runtime');
var vinylFS = require('vinyl-fs');
var globWatch = require('glob-watcher');

var util = require('./lib/util');
var gulpCLI = require('./lib/cli');

var Gulp = module.exports = Runtime.createClass({
  src: vinylFS.src,
  dest: vinylFS.dest,
  create: function Gulp (props) {
    Gulp.super_.call(this, props);
    this.tasks = new Parth({defaultRE: /\S+/});

    this.log = this.props.log === void 0 || this.props.log;
    this.gulpfile = util.getGulpFile();

    if (this.log) {
      util.log('Using gulpfile', util.format.path(this.gulpfile));
    }

    if (this.props.repl) {
      this.repl = Gulp.repl.start(this);
    }

    // adds the CLI for this instance and runs it for this
    gulpCLI(this);
  }
});

/**
 * static methods
**/

Gulp.repl = require('gulp-repl');

/**
 * instance methods
**/

// gulp.task
Gulp.prototype.task = function (name, deps, handle) {
  handle = util.type(handle || deps || name).function || '';
  deps = util.type(deps).array || util.type(name).array;
  name = util.type(name).string || util.type(handle.name).string;

  if (name && !deps && !handle) {
    return (this.tasks.get(name) || {fn: null}).fn;
  }

  if (handle && handle.name !== name) {
    handle.displayName = name;
  }

  if (name && deps && handle) {
    var tasks = deps.concat(handle);
    var composer = this.series.apply(this, tasks);
    this.tasks.set(name, { name: name, fn: composer });
  } else if (name && deps) {
    var composer = this.stack.apply(this, deps);
    this.tasks.set(name, { name: name, fn: composer });
  } else if (name) {
    this.tasks.set(name, { name: name, fn: handle });
  }

  return this;
};

// gulp.watch
Gulp.prototype.watch = function (glob, opt, fn) {
  var tasks = util.type(opt).array;
  var handle = util.type(fn || opt).function;

  if (tasks) {
    var composer = this.stack.apply(this, tasks);
    return globWatch(glob, function (/* arguments */) {
      var args = __slice.call(arguments);
      composer.apply(null, handle ? args.concat(handle) : args);
    });
  }

  return globWatch(glob, opt, fn);
};

// gulp.tree
Gulp.prototype.tree = function (stack, options) {
  options = options || {};

  var self = this;
  var tasks = null;

  if (Array.isArray(stack)) {
    tasks = util.merge([], { props: stack.props });

    for (var i = 0, l = stack.length; i < l; ++i) {
      tasks = this.reduceStack(tasks, stack[i], i, stack);
    }

  } else {

    tasks = Object.keys(this.tasks.store).filter(function (task) {
      return !/^\:cli/.test(task);
    }).map(function (name) {
      return self.tasks.store[name];
    });

    if (options.simple) { return tasks; }
  }

  var tree = {
    label: options.label || '',
    nodes: []
  };

  tasks.forEach(function (task) {
    if (!task || !task.fn) { return; }
    var node;

    if (Array.isArray(task.fn.stack)) {
      node = self.tree(task.fn.stack, {
        host: task
      });
    } else {
      node = {
        label: task.match || task.name
      };
    }

    tree.label += (tree.label && ', ' + node.label) || node.label;
    tree.nodes.push(node);
  });

  return tree;
};

// override of runtime.reduceStack
// maps all the arguments for the gulp.stack to functions

Gulp.prototype.reduceStack = function (stack, site) {
  var task = null;

  if (site && typeof (site.fn || site) === 'function') {
    task = site.fn && util.clone(site, true) || {
      fn: site,
      name: site.displayName || site.name
    };
  } else {
    task = this.tasks.get(site);
  }

  if (!task) {
    util.log('Task `%s` is not defined yet', util.format.task(site));
    util.log('Not sure how to do that? See %s', util.docs.task);

    if (util.isFromCLI(this)) {
      process.exit(1);
    } else {
      throw new Error('task not found');
    }
  }

  stack.push(task);

  if (Array.isArray(task.fn.stack)) {
    task.label = task.name || this.tree(task.fn.stack).label;
  } else {
    task.label = task.match || task.name;
  }

  return stack;
};


/**
 * tasks logging
**/

Gulp.prototype.onHandleStart = function (task, stack) {
  if (!this.log || (task.params && task.params.cli)) {
    return;
  }

  if (!stack.time) {
    stack.time = process.hrtime();
    stack.label = this.tree(stack).label;
  }

  if (Array.isArray(task.fn && task.fn.stack) && task.fn.stack.props) {
    stack.match = task.match || task.name || task.displayName;
    stack.siteProps = task.fn.stack.props;
    util.log('Start', util.format.task(stack));
  }

  task.time = process.hrtime();
};

Gulp.prototype.onHandleEnd = function (task, stack) {
  if (this.log && !(task.params && task.params.cli)) {

    if (!(task.fn && Array.isArray(task.fn.stack)) && task.label) {
      util.log(' %s took %s',
        util.format.task(task),
        util.format.time(task.time)
      );
    } else if (stack.end) {
      util.log('Ended %s after %s',
        util.format.task(stack),
        util.format.time(stack.time)
      );
    }
  }
};

/**
 * error handling
**/

Gulp.prototype.onHandleError = function (error, site, stack) {
  util.log('%s threw an error after %s',
    util.format.error(site && site.label || this.tree(stack).label),
    util.format.time(site.time)
  );

  util.log(error.stack);
};

/**
 * With some sugar on top please
**/

Gulp.prototype.start = function (/* arguments */) {
  var args = null;
  var tasks = arguments;

  if (util.type(arguments[0]).array) {
    args = __slice.call(arguments, 1);
    tasks = arguments[0];
  }

  var composer = this.stack.apply(this, tasks.length ? tasks : ['default']);
  return composer.apply(this, args);
};

Gulp.prototype.series = function (/* arguments */) {
  var args = __slice.call(arguments);
  var props = util.type(args[args.length - 1]).plainObject && args.pop() || {};
  var tasks = args.concat(util.merge(props, {wait: true}));
  return this.stack.apply(this, tasks);
};

Gulp.prototype.parallel = function (/* arguments */) {
  var args = __slice.call(arguments);
  var props = util.type(args[args.length - 1]).plainObject && args.pop() || {};
  var tasks = args.concat(util.merge(props, {wait: false}));
  return this.stack.apply(this, tasks);
};
