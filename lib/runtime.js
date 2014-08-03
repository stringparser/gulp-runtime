/*
 * Module dependencies
 *
 * NOTE:
 *  - Variables starting with "x" are refs.
 *  - `ref` notation is a convention to say
 *    that it can/will be modified elsewhere.
 */

var EventEmitter = require('events').EventEmitter;

var util = require('./util');
var Command = require('./command/constructor');
var RuntimeError = require('./command/error');
var RuntimeWarning = require('./command/warning');

var prettyfy = util.prettyfy;
var merge = util.merge;

/*
 * Runtime module
 */

exports = module.exports = {};

/*
 * Runtime refs
 *
 *  xHandle : the `runtimes` holder.
 *  xInterface : a readlinexInterface.
 *  xInterfaceEvents : original xInterface events.
 *
 */

var xHandle = {};
var xInterface = require('./interface');
var xInterfaceEvents = merge({}, xInterface._events);

/*
 * Module [Getters]
 */

defineGetter(xHandle, '_current', function(){
  return xHandle[xHandle._currentInterface];
});

// ## Hook the xInterface's `line` event
//    to the current Handle see './interface'
defineGetter(xInterface, 'xHandle', function(){
  return xHandle._current;
});

// ## Proxy the xInterface's completer
defineGetter(xInterface, 'completer', function(){
  return xHandle._current.completer;
});

/*
 * doc holder
 */

function createInterface(name){

  if(!name){
    throw RuntimeError(
      'To create a runtime you need a name'
    );
  }
  else {
    xHandle._currentInterface = name;
  }

  if(!xHandle[name]){

    var runtime = new Runtime(name);

    xHandle[name] = runtime;

    return runtime;
  }
  else {
    return xHandle[name];
  }
}
/*
 * Expose createInterface constructor
 */
exports.createInterface = createInterface;

/*
 * doc holder
 */

function Runtime(name){

  if(!name){
    throw RuntimeError('To create a `runtime` you need a name.');
  }

  if( !(this instanceof Runtime) ){
    return new Runtime(name);
  }
  else {

    // ## Defaults
    this._timer = {};
    this._name = name;
    this.setPrompt(' > '+name+ ' ');
    this._events = require('./command/events');

    // ## Command parsing
    this.parser = require('./command/parser');

    // ## Creating the runtime namespace
    this.set();

    EventEmitter.call(this);
  }
}
merge(Runtime.prototype, EventEmitter.prototype);

/*
 * Expose the `Runtime` constructor
 */
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
Runtime.prototype.get = function(/* arguments */){

  var anchor = {
         fn : function Root(){},
      _name : this._name,
    _parent : this._name
  };

  var command = new Command(anchor);
  var args = [].slice.call(arguments);

  return command.get.apply(command, args);
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

  util.onDT(this, function(){
    console.log(' Handling ', cmd);
    console.log(' From the terminal   :');
    console.log(' get anchor returned :', this.get(cmd));
  })

  var command;

  if(!command){
    RuntimeWarning({
      message : 'Command "'+ cmd +'" not defined.'
    });
  }
  else if(typeof command === 'function'){
    command.call(this, cmd, args);
  }

  this.emit('done', cmd, args, cb);
};

/*
 * doc holder
 */

Runtime.prototype.completer = function(line){

  var completion = [];
  if(completion.length !== 0){
    var hits = completion.filter(function(c) {
        return c.indexOf(line) === 0;
      });

    // show all completions if none found
    return [hits.length ? hits : completion, line];
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
     xInterface.emit(eventName);
      fn.call(self);
    },10);
  else {
    clearTimeout(timer.startup);
    timer[eventName] = setTimeout(function(){
     xInterface.emit(eventName);
      fn.call(self);
    });
  }
};

/*
 * doc holder
 */

Runtime.prototype.onStartup = function(fn){

  var self = this;

 this.on('startup', function(){
    fn.call(self);
  })

  this.waiting('startup');
};

/*
 * Runtime'sxInterface `prompt`
 */
Runtime.prototype.prompt = function(/* arguments */){

  xInterface.prompt.apply(
    xInterface, [].slice.call(arguments)
  );
}
/*
* Runtime'sxInterface `setPrompt`
 */
Runtime.prototype.setPrompt = function(/* arguments */){

  xInterface.setPrompt.apply(
    xInterface, [].slice.call(arguments)
  );
};

/*
 * Order the prototype by key length
 * just to be nicer to `console.log`s
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