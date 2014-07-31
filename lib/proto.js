/*
 * Module dependencies
 */

var RuntimeCommand = require('./cmd/ctor');
var RuntimeError = require('./runtime-error');
var RuntimeWarning = require('./runtime-warning');
var prettyfy = require('../util/prettyfy')

/*
 * Runtime prototype
 */
var runtime = exports = module.exports;

/*
 * doc holder
 */
runtime.onStartup = function(fn){

  var Interface = this._interface;
  var self = this;

  Interface.on('startup', function(){
    fn.call(self)
  })

  delay.call(Interface, 'startup');
}



runtime.command = function(key, self){

  if(typeof self !== 'function')
   self = this;

  return new RuntimeCommand(key, self);
}

runtime.set = function(cmd, fn){

  return this.command(cmd, this).set(cmd, fn);
}

runtime.get = function(cmd){

  return this.command(cmd, this).get(cmd);
}

/*
 * doc holder
 */
runtime.handle = function(cmd, args, cb){

  var Interface = this._interface;

  console.log('handling "%s"', cmd)
  prettyfy.color(arguments);

  var Command = this.command(cmd).get(cmd)

  if(!Command){
    RuntimeWarning({
      message : 'Command "'+ cmd +'" not defined.'
    });
  }
  else if(typeof Command === 'function')
    Command.call(this, cmd, args);

  Interface.emit('done', cmd, args, cb);
}

/*
 * Runtime's Interface `prompt` proxy
 */
runtime.prompt = function promptProxy(/* arguments */){
  proxy(this._interface, 'prompt', arguments)
}

/*
 * doc holder
 */
runtime.setPrompt = function setPromptProxy(/* arguments */){
  proxy(this._interface, 'setPrompt', arguments)
}

/*
 * doc holder
 */
runtime.emit = function emitProxy(/* arguments */){
  proxy(this._interface, 'emit', arguments);
}

/* ---------------------------------------------------------------
 *                Local (PRIVATE + SHARED)
 * ---------------------------------------------------------------
 *  - command : the commands holder.
 *  - waitFor : the timers holder.
 *  - delay   : helper to delay events.
 *  - proxy   : helper to proxy runtime._interface functions
 *
 */

/*
 * PRIVATE
 */
var waitFor = {};
var delay = function(eventName){

  var self = this;

  if(!waitFor[eventName])
    waitFor[eventName] = setTimeout(function(){
      self.emit(eventName);
    });
  else {
    clearTimeout(waitFor[eventName]);
    waitFor[eventName] = setTimeout(function(){
      self.emit(eventName);
    });
  }
}

function proxy(self, method, args){
  self[method].apply(self, [].slice.call(args) );
}


function defineGetter(obj, name, getter) {
  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    get: getter
  });
};