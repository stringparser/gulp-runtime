'use strict';

var __slice = Array.prototype.slice;

var Parth = require('parth');
var Runtime = require('runtime');
var vinylFS = require('vinyl-fs');
var gulpREPL = require('gulp-repl');
var globWatch = require('glob-watcher');

var util = require('./lib/util');
var gulpCLI = require('./lib/cli');

var Gulp = module.exports = Runtime.createClass({
  src: vinylFS.src,
  dest: vinylFS.dest,
  create: function Gulp (props) {
    Gulp.super_.call(this, props);
    this.tasks = new Parth({defaultRE: /\S+/});

    this.log = this.log === void 0 || this.log;
    this.gulpfile = util.getGulpFile();

    if (this.log) {
      util.log('Using gulpfile', util.format.path(this.gulpfile));
    }

    if (this.repl) {
      this.repl = gulpREPL(this);
      util.log('REPL enabled');
    }

    // adds the CLI for this instance and runs it for this
    gulpCLI(this);
  }
});

/**
 * gulp.task
**/

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
    this.tasks.set(name, {name: name, fn: composer});
  } else if (name && deps) {
    var composer = this.stack.apply(this, deps);
    this.tasks.set(name, {name: name, fn: composer});
  } else if (name) {
    this.tasks.set(name, {name: name, fn: handle});
  }

  return this;
};

/**
 * gulp.watch
**/

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

/**
 * gulp.tree
**/

Gulp.prototype.tree = function (options) {
  options = options || {};

  var self = this;
  var tree = {label: options.label || '', nodes: []};
  var depth = options.depth === void 0 || options.depth;
  if (depth && typeof depth !== 'number') { depth = 1; }

  if (!(this instanceof Runtime.Stack)) {
    var tasks = Object.keys(this.tasks.store).filter(function (task) {
      return !/^\:cli/.test(task);
    });

    if (options.simple) { return tasks; }

    tasks.forEach(function (name) {
      var task = self.tasks.store[name];
      var node = {label: task.name};

      if (task.fn.stack instanceof Runtime.Stack) {
        node = task.fn.stack.tree({
          host: task,
          depth: depth < options.depth ? depth + 1 : false
        });
      }

      tree.nodes.push(node);
    });
    return tree;
  }

  var sites = this.length ? this : this.reduce();

  sites.forEach(function (task) {
    if (!task || !task.fn) { return; }
    var node = task;

    if (task.fn.stack instanceof Runtime.Stack) {
      node = task.fn.stack.tree({
        host: task,
        depth: depth < options.depth && (depth + 1) || false
      });
    }

    tree.label += (tree.label && ', ' + node.label) || node.label;
    tree.nodes.push(node);
  });

  if (options.host && options.host.name) {
    tree.label = options.host.name;
    tree.nodes = tree.nodes.filter(function (node) {
      return node.label !== tree.label;
    });
    tree.label = util.chalk.underline(tree.label);
  }

  return tree;
};

/**
 * maps all the arguments of gulp.stack to functions
**/

Gulp.prototype.reduceStack = function (stack, site) {
  var task = typeof site === 'function'
    ? {fn: site}
    : this.tasks.get(site);

  if (!task) {
    util.log('Task `%s` is not defined yet',
      util.format.task(site)
    );

    util.log('Not sure how to do that? See %s',
      util.format.link(util.docs.task)
    );

    if (util.isFromCLI(this)) {
      return process.exit(1);
    }

    throw new Error(
      'task `' + util.format.task(site) + '` is not defined yet'
    );
  }

  stack.push(task);

  if (task.fn.stack instanceof Runtime.Stack) {
    task.mode = task.fn.stack.wait ? 'series' : 'parallel';
  } else {
    task.label = task.name || task.fn.displayName || task.fn.name;
  }
};


/**
 * logging
**/

Gulp.prototype.onHandleStart = function (task, stack) {
  if (!this.log || (task.params && task.params.cli)) {
    return;
  }

  if (!stack.time) {
    stack.time = process.hrtime();

    stack.deep = stack.length > 1;
    stack.mode = stack.wait ? 'series' : 'parallel';
    stack.label = stack.tree().label;

    if (stack.deep && !stack.host) {
      util.log('Start', util.format.task(stack));
    }
  }

  if (task.mode) {
    task.label = task.fn.stack.tree().label;
  }

  if (task.mode || (!stack.deep && !stack.host)) {
    util.log('Start', util.format.task(task));
  }

  task.time = process.hrtime();
};

Gulp.prototype.onHandleEnd = function (task, stack) {
  if (this.log && !(task.params && task.params.cli)) {

    if (!task.mode) {
      util.log(' %s took %s',
        util.format.task(task),
        util.format.time(task.time)
      );
    }

    if (!stack.host && stack.end) {
      util.log('Ended %s after %s',
        util.format.task(stack.deep ? stack : task),
        util.format.time(stack.time)
      );
    }
  }

  if (this.repl && stack.end && !stack.host) {
    var self = this;
    clearTimeout(this.timeout);
    this._timeout = setTimeout(function () {
      self.repl.prompt();
    }, 250);
  }
};

/**
 * error handling
**/

Gulp.prototype.onHandleError = function (error, site, stack) {
  util.log('%s threw an error after %s',
    util.format.error(site.label || stack.tree().label),
    util.format.time(site.time)
  );

  if (!this.repl) { throw err; }

  util.log('at %s',
    util.format.path(error.stack.match(/\/[^)]+/).pop())
  );
};

/**
 * With some sugar on top please
**/

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
