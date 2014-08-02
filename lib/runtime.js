/*
 * Module dependencies
 */

var Interface = require('./interface');
var Command = require('./cmd/constructor');
var RuntimeError = require('./runtime-error');
var RuntimeWarning = require('./runtime-warning');
var prettyfy = require('../util/prettyfy');

/*
 * Runtime module
 */

exports = module.exports = {};

/*
 * Module refs
 *
 *  -  handle : the `runtimes` holder.
 *
 *  @api private
 */

var handle = {};

/*
 * Module [Getters]
 *
 * @api private
 */

defineGetter(Interface, 'handle', function(){
  return handle[handle._current];
})

defineGetter(Interface, 'completer', function(){
  return this.handle.completer;
})

/*
 * doc holder
 */

function createRuntime(name){

  if(!name)
    throw RuntimeError(
      'To create a runtime you need a name'
    );
  else
    handle._current = name;

  if(!handle[name]){

    var runtime = new Runtime(name);

    handle._current = name;
    handle[name] = runtime;

    return function (cmd, args, cb){
      return runtime.handle(cmd, args, cb);
    };
  }
  else
    return handle[name];
}
exports.createRuntime = createRuntime;

/*
 *
 */

function Runtime(name){

  if(!name)
    throw RuntimeError(
      'To create a runtime you need a name'
    );

  if( !(this instanceof Runtime) )
    return new Runtime(name);

  this._name = name;
  this._timer = {};

  // Create the runtime instance namespace
  this.set();
}
exports.Runtime = Runtime;

/*
 * doc holder
 */
Runtime.prototype.set = function(name, fn){

    fn = fn ? fn : function Root(){};
  name = name ? name : this._name;

  var anchor = {
            fn : fn,
         _name : name,
       _parent : this._name,
      children : {},
    completion : []
  }

  if(arguments.length === 0)
    return new Command(anchor);
  else
    return (new Command(anchor)).set(name, fn);
}
/*
 * doc holder
 */
Runtime.prototype.get = function(name){

  name = name ? name : this._name;

  var anchor = {
         fn : function Root(){},
      _name : name,
    _parent : this._name
  };

  return (new Command(name, anchor)).get(name);
}

/*
 * doc holder
 */
Runtime.prototype.handle = function(cmd, args, cb){

  console.log('handling "%s"', cmd)
  prettyfy.color(arguments);

  var command = this.command(cmd).get()

  if(!command){
    RuntimeWarning({
      message : 'Command "'+ cmd +'" not defined.'
    });
  }
  else if(typeof command === 'function')
    command.call(this, cmd, args);

  Interface.emit('done', cmd, args, cb);
}

/*
 * doc holder
 */

Runtime.prototype.completer = function(line){

  if(completions.length !== 0){
    var hits = completions.filter(function(c) {
        return c.indexOf(line) == 0;
      });

    // show all completions if none found
    return [hits.length ? hits : completions, line];
  }
  else
    return [ [''], line];
}

/*
 * doc holder
 */
Runtime.prototype.waiting = function(eventName){

  var timer = this._timer;

  if(!timer[eventName])
    timer[eventName] = setTimeout(function(){
      Interface.emit(eventName);
    });
  else {
    clearTimeout(timer.startup);
    timer[eventName] = setTimeout(function(){
      Interface.emit(eventName);
    });
  }
}

/*
 * doc holder
 */

Runtime.prototype.onStartup = function(fn){

  var self = this;

  Interface.on('startup', function(){
    fn.call(self);
  })

  this.waiting('startup');
}

/*
 * Runtime's Interface `prompt` proxy
 */
Runtime.prototype.prompt = function(/* arguments */){

  Interface.prompt.apply(
    Interface, [].slice.call(arguments)
  );
}
/*
 * doc holder
 */
Runtime.prototype.setPrompt = function(/* arguments */){

  Interface.setPrompt.apply(
    Interface, [].slice.call(arguments)
  );
}
/*
 * doc holder
 */
Runtime.prototype.emit = function(/* arguments */){

  Interface.emit.apply(
    Interface, [].slice.call(arguments)
  );
}

function defineGetter(obj, name, getter) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    get: getter
  });
};