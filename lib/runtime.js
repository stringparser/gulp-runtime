/*
 * Module dependencies
 */

var path = require('path');
var util = require('util');
var merge = require('utils-merge');
var readline = require('readline');

var RuntimeError = require('./runtime-error');
var RuntimeWarning = require('./runtime-warning');
var parseCMD = require('../util/parseCMD');

/*
 * Expose the `Runtime` interface
 * -----------------------------------
 *  `Runtime` is a suttle modification
 *  of the `readline` core module to provide
 *  some customization.
 *
 *  Added:
 *   - Runtime.prototype.set
 *   - Runtime.prototype.get
 *   - Runtime.prototype.attach
 *
 *   ^ Used to create commands for a CLI.
 */
exports = module.exports = Runtime;

/*
 * module refs (helpers)
 */
var Interface = readline.Interface;

/*
 * `Runtime` constructor
 *
 *   - Inherits from `readline.Interface`
 *   - Only one instance is allowed
 *     (hack) that solves the case when the input
 *     is the same and you create more than one istance.
 */

function Runtime(options){

  if( !(this instanceof Runtime) ){
    return new Runtime(options);
  }
  else {

    // attach the readline Interface
    Interface.call(this, options)

    // - wire up events for the Instance
    // - make an empty `handle` wrapper
    this._events = listen;
    this.handle = null;

    // - setup `input` events
    this.input.on('keypress', function(){

    })
  }
}
util.inherits(Runtime, Interface);

/*
 * Runtime `set` and `get`
 *
 *  - Create runtime commands with this methods.
 *
 *  - The above abstraction is to useful to be
 *    more reasonable on what to pass
 *    to a command when is runned at runtime.
 */
var command = {}, runtime_command = {};

/*
 * Runtime set:
 *  - set a command `key` to run a function
 */

Runtime.prototype.set = function (key, fn){


  if(!key)
    throw RuntimeError(
      'Falsey keys like '+key+' are not a command.'
    );
  else if(typeof key !== 'string')
     throw RuntimeError(
      'Command "'+key+"' should be a `string`."
    );

  if(typeof fn !== 'function')
    throw RuntimeError(
      'Command "'+key+"' `handle` is not a function."
    );

  key = key.trim();
  if( key[0] === '-')
    throw RuntimeError(
      'Hyphen starting commands are not allowed.\n' +
      'Flags are used only by `'+this.runtime_name+'`.'
    );
  else if(key === this.runtime_name)
    throw RuntimeError(
      'Command "'+this.runtime_name+'" is not allowed.\n' +
      'Is reserved for the runtime'
    );

  key = (key).toString();

  if(!command[key])
    return command[key] = fn;
  else if(command[key])
    throw RuntimeError('Command "'+key+'" already exists.');
    // ^ Don't override if command exists.
    // Throw error so one can see where source code lives.
    // Can save headaches... or maybe annoying, we'll see :D.
}

/*
 * Runtime `get`:
 *  - get a command `key` for a function
 *
 * If command doesn't exists return false.
 */
Runtime.prototype.get = function(key){

  if(typeof key === 'undefined')
    return Object.keys(command);
    // > Helper to see all commands
  else if(command[key])
    return command[key];
  else if(key === this.runtime_)
    return runtime_command[key];
  else
    return false;
}

/*
 * Event handlers for the Interface instance
 *
 *  - `listen` variable holds the Instance events.
 *  - There is only one runtime Instance.
 *  - event's are dispached based on the first argument
 */
var listen = {};


/*
 * handle the `startup` event
 */

listen.startup = function onStartup(cb){

  if(typeof cb === 'function')
    cb.call(this);
}

/*
 * handle `line` events
 */
listen.line = function onLine(cmd){

  var args = cmd.trim();

  if( args === '')
    this.emit('done');
  else {

    args = parseCMD(cmd);
    this.emit('next', args.argv[0], args, 0);
  }
}

/*
 * handle `start` events
 */
listen.next = function onNext(cmd, args, index){

  var self = this;

  wrap.call(this, cmd, args, index, function (){

    cmd = args.argv[index+1];

    if(cmd)
      self.emit('next', cmd, args, index+1);
    else
      self.emit('done', cmd, args, index+1);
  })

}

/*
 * handle `done` events
 */
listen.done = function onDone(cmd, index, args){
  this.prompt(true);
}

/*
 * Runtime `handle`:
 *  - called before any coomand.
 *
 *  - Changes on the behavior of the
 *    `Runtime` instance should go here.
 *
 *  - `handle` is called whenever a 'next'
 *    or 'done' event is fired, `this` is
 *    set to the current instance.
 *
 *  - API: private
 */

function wrap(cmd, args, index, callback){

  var command = this.get(cmd);
  var followUp;

  if(this.handle){

    if(typeof this.handle !== 'function')
      throw RuntimeError({
        message : 'Your handle should be a function'
      });
    else
      followUp = this.handle.call(null, cmd, args, next);
  }
  else if(typeof command === 'function')
    followUp = command(cmd, args, next);
  else
    return RuntimeWarning.call(this, {
      message : 'Command "'+args.raw[0]+'" not defined.'
    });

  // auto follow up
  if(followUp) next();
  else         this.emit('done');

  var self = this;
  //
  // ## Similar to express's next
  //    you have to call it in order to
  //    continue
  function next(){
    callback.call(self);
  }
}

/*
 * Runtime commandline `completer`:
 *
 *  - Currently only support for custom commands.
 */

// on `tab` completer
// structure taken from node's documentation
exports.completerFn = function completerFn(line){

  var completions = Runtime.prototype.get();

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