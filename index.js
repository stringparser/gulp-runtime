'use strict';

var Parth = require('parth');
var Runtime = require('runtime');
var vinylFS = require('vinyl-fs')

var util = require('./lib/util');
var __slice = Array.prototype.slice;

var Gulp = module.exports = Runtime.createClass({
  src: vinylFS.src,
  dest: vinylFS.dest,
  create: function Gulp(props){
    Gulp.super_.call(this, props);
    this.tasks = new Parth();

    this.log = this.log === void 0 || this.log;
    this.argv = util.type(this.argv).array || [];
    this.gulpfile = new Error().stack.match(/\/([^:()]+)/g)[2];

    if(this.repl && !util.isSilent){
      util.log('REPL', util.format.enabled('enabled'));
      this.repl = require('gulp-repl')(this);
    } else if(this.repl){
      this.repl = false;
    }

    if(this.log && util.logGulpfile){
      util.log('Using gulpfile ' + util.format.path(this.gulpfile));
    }
    // add cli tasks and run the cli for this instance
    require('./lib/cli')(this);
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
  } else if(name && handle && handle.name !== name){
    handle.displayName = name;
  }
  handle = handle || function(next){ next(); };

  if(name && deps && deps.length){
    this.tasks.set(name, {
      fn: this.stack.apply(this, deps.concat(handle, {wait: true})),
      label: name,
      hasDeps: true
    });
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

**/
Gulp.prototype.tree = function(options){
  options = options || {};
  options.deep = options.deep === void 0 || options.deep;

  var self = this;
  var tree = {label: options.label || '', nodes: []};

  if(!(this instanceof Runtime.Stack)){
    if(options.simple){
      return Object.keys(this.tasks.store).filter(function(task){
        return !/^\:cli/.test(task);
      });
    }

    Object.keys(this.tasks.store).forEach(function(name){
      var task = self.tasks.store[name];
      tree.nodes.push(task.fn.stack instanceof Runtime.Stack
        ? task.fn.stack.tree({deep: options.deep, host: task})
        : task
      );
    });
    return tree;
  }

  var sites = this.length ? this : this.reduce();
  for (var index = 0, length = sites.length; index < length; ++index) {
    var site = sites[index];
    if(!site || !site.fn){ continue; }

    if(options.deep && site.fn.stack instanceof Runtime.Stack){
      var opts = util.merge({}, options, {host: site});
      tree.nodes.push(site.fn.stack.tree(opts));
    } else {
      tree.nodes.push(site);
    }

    tree.label += (tree.label && ', ' + site.label) || site.label;
  }

  if(options.host && options.host.label){
    tree.label = options.host.label;
    tree.nodes = tree.nodes.filter(function(node){
      return node.label !== tree.label;
    });
  }

  return tree;
};

/**
 maps all the arguments of gulp.stack to functions
**/
Gulp.prototype.reduceStack = function(stack, site){
  var task = this.tasks.get(site) || (
    typeof site === 'function' && {fn: site}
  );

  if(!task){
    util.log('Task `%s` is %s',
      util.format.task(site),
      util.format.error('not defined yet')
    );

    util.log('Not sure how to do that? See: %s',
      util.format.link(util.docs.task)
    );

    throw new Error('task not defined yet');
  }

  if(!task.label){
    task.label = task.fn.stack instanceof Runtime.Stack
      ? task.fn.stack.tree().label
      : task.fn.displayName || task.fn.name || 'anonymous'
  }

  stack.push(task);
};


/**
 logging
**/
Gulp.prototype.onHandle = function(task, stack){
  if(!this.log || (task.params && task.params.cli)){
    return;
  }

  var deep = stack.length > 1;

  if(!stack.time){
    stack.time = process.hrtime();
    stack.mode = stack.wait ? 'series' : 'parallel';
    stack.label = stack.label || stack.tree().label;
    if(deep && !stack.host){
      util.log('Start %s(%s)',
        util.format.mode(stack.mode),
        util.format.task(stack.label)
      );
    }
  }

  if(!task.time){
    task.time = process.hrtime();

    if(!deep && !task.hasDeps){
      util.log('Start %s', util.format.task(task.label));
    } else if(task.hasDeps){
      util.log('Start %s:%s(%s)',
        util.format.task(task.label),
        util.format.mode('series'),
        util.format.task(task.fn.stack.tree().label)
      );
    } else if(task.fn.stack instanceof Runtime.Stack){
      util.log('Start %s(%s)',
        util.format.mode(task.fn.stack.wait ? 'series' : 'parallel'),
        util.format.task(task.fn.stack.tree().label)
      );
    }
    return;
  }

  if(deep){
    if(!(task.fn.stack instanceof Runtime.Stack)){
      util.log('- %s took %s',
        util.format.task(task.label),
        util.format.time(task.time)
      );
    } else if(stack.end){
      util.log('Ended %s(%s) after %s',
        util.format.mode(stack.mode),
        util.format.task(stack.label),
        util.format.time(stack.time)
      );
    }
  } else if(stack.end){
    if(task.hasDeps){
      util.log('Ended %s:%s(%s) after %s',
        util.format.task(task.label),
        util.format.mode('series'),
        util.format.task(task.fn.stack.tree().label),
        util.format.time(task.time)
      );
    } else {
      util.log('Ended %s after %s',
        util.format.task(task.label),
        util.format.time(task.time)
      );
    }
  }

  if(this.repl && stack.end && !stack.host){
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

  console.log('%s failed after %s',
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
