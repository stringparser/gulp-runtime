/*
 * Module dependencies
 */

var util = require('./util');

var Interface = require('./interface');
var Command = require('./command/constructor');
var RuntimeError = require('./command/error');
var RuntimeWarning = require('./command/warning');

var prettyfy = util.prettyfy;

/*
 * Runtime module
 */

exports = module.exports = {};

/*
 * Runtime refs/helpers
 *
 *  - handle : the `runtimes` holder.
 *
 *  @api private
 */

var handle = {};

/*
 * Module [Getters]
 */

defineGetter(Interface, 'handle', function(){
  return handle[handle._current];
});

defineGetter(Interface, 'parser', function(){
  return handle[handle._current].parser;
});

defineGetter(Interface, 'completer', function(){
  return handle[handle._current].completer;
});

/*
 * doc holder
 */

function createRuntime(name){

  if(!name){
    throw RuntimeError(
      'To create a runtime you need a name'
    );
  }
  else {
    handle._current = name;
  }

  if(!handle[name]){

    var self = new Runtime(name);

    var runtime = function (cmd, args, cb){
      return runtime.terminal(cmd, args, cb);
    };

    util.merge(runtime, self);

    handle._current = name;
    handle[name] = runtime;

    return runtime;
  }
  else {
    return handle[name];
  }
}
exports.createRuntime = createRuntime;

/*
 * doc holder
 */

function Runtime(name){

  if(!name){
    throw RuntimeError(
      'To create a `runtime` you need a name.'
    );
  }

  if( !(this instanceof Runtime) ){
    return new Runtime(name);
  }
  else {

    // Defaults
    this._name = name;
    this._timer = {};
    this.setPrompt(' > '+name+ ' ');

    // The basic command parser
    this.parser = require('./command/parser');

    // Creating the runtime namespace
    this.set();
  }
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
  };

  if(arguments.length === 0){
    return new Command(anchor);
  }
  else{
    return (new Command(anchor)).set(name, fn);
  }
};
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

  return (new Command(anchor)).get(name);
};

/*
 * Runtime instance namespace handle
 *
 *
 */
Runtime.prototype.handle = function(){
};

/*
 * doc holder
 */
Runtime.prototype.terminal = function(cmd, args, cb){

  console.log('handling "%s"', cmd)
  prettyfy.color(arguments);

  var command = this.get(cmd).fn

  if(!command){
    RuntimeWarning({
      message : 'Command "'+ cmd +'" not defined.'
    });
  }
  else if(typeof command === 'function'){
    command.call(this, cmd, args);
  }

  Interface.emit('done', cmd, args, cb);
};

/*
 * doc holder
 */

Runtime.prototype.completer = function(line){

  var completion = [];
  if(completions.length !== 0){
    var hits = completions.filter(function(c) {
        return c.indexOf(line) == 0;
      });

    // show all completions if none found
    return [hits.length ? hits : completions, line];
  }
  else{
    return [ [''], line];
  }
};

/*
 * doc holder
 */
Runtime.prototype.waiting = function(eventName, fn){

  var self = this;
  var timer = this._timer;

  fn = fn ? fn : function(){}

  if(!timer[eventName])
    timer[eventName] = setTimeout(function(){
      Interface.emit(eventName);
      fn.call(self);
    },10);
  else {
    clearTimeout(timer.startup);
    timer[eventName] = setTimeout(function(){
      Interface.emit(eventName);
      fn.call(self);
    });
  }
};

/*
 * doc holder
 */

Runtime.prototype.onStartup = function(fn){

  var self = this;

  Interface.on('startup', function(){
    fn.call(self);
  })

  this.waiting('startup');
};

Runtime.prototype.resume = function(){

  Interface.resume();
};

/*
 * Runtime's Interface `prompt`
 */
Runtime.prototype.prompt = function(/* arguments */){

  Interface.prompt.apply(
    Interface, [].slice.call(arguments)
  );
}
/*
* Runtime's Interface `setPrompt`
 */
Runtime.prototype.setPrompt = function(/* arguments */){

  Interface.setPrompt.apply(
    Interface, [].slice.call(arguments)
  );
};

/*
 * doc holder
 */

Runtime.prototype.emit = function(/* arguments */){

  Interface.emit.apply(
    Interface, [].slice.call(arguments)
  );
};


/*
 * Order the prototype by key length
 */
var unOrdered = Runtime.prototype;
var ordered = {};
var keys = Object.keys(Runtime.prototype)

keys.sort(function(key, next){
  return key.length-next.length;
}).forEach(function(method){
  ordered[method] = unOrdered[method];
});

Runtime.prototype = ordered;


function defineGetter(obj, name, getter) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    get: getter
  });
};