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
 * Expose the `RuntimeInterface` wrapper
 * -----------------------------------
 *  `Runtime` is a suttle modification
 *  of the `readline` core module to provide
 *  some customization.
 *
 *  Added:
 *   - Runtime.prototype.set
 *   - Runtime.prototype.get
 *   - instance._events handlers (see below)
 *   - instance.handle           (see below)
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

var instance = exports.instance;

function Runtime(options){

  if( !(this instanceof Runtime) ){
    instance = new Runtime(options);
    return instance;
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
 * `createInterface` function
 *
 * - Instantiates the runtime if doesn't exists
 * - wraps up the instance to consume from
 */

function createInterface(options){

  if(!instance)
    instance = new Runtime(options);

  /*
   * wrap up the instance
   */
  function runtime(key, fn){
    runtime.handle(key, fn);
  }

  /*
   * methods point
   * from the instance to the runtime
   */

  runtime.emit = function(/* arguments */){
    instance.emit.apply(instance,
      [].slice.call(arguments)
    );
  }

  runtime.onStartup = function(fn){
    if(typeof fn === 'function')
      instance.emit('startup', fn);
    else
      throw RuntimeError(fn + ' must be a function');
  }

  runtime.onNext = function(fn){
    instance.handle = fn;
  }

  runtime.onDone = function(fn){
    instance.emit.call(runtime, 'done', fn)
  }

  runtime.get = function(key){
    instance.get(key)
  }

  runtime.set = function(key, value){
    instance.set(key, value);
  }

  runtime.setPrompt = function(prompt_text, prompt_length){
    if(prompt_length)
      instance.setPrompt(prompt_text, prompt_length);
    else
      instance.setPrompt(prompt_text);
  }

  runtime.prompt = function(){
    instance.prompt();
  }

  //
  // runtime handle
  runtime.handle = function(key, fn){

    if(!key)
      throw RuntimeError('Falsey commands like '+key+' are not allowed.');
    else if(typeof key !== 'string')
       throw RuntimeError(
        'Command "'+key+"' should be a `string`."
      );

    key = key.trim();

    if(arguments.length === 1)
      return runtime_command[key];
    else if(typeof fn !== 'function')
      throw RuntimeError(
        'Command "'+key+"' `handle` is not a function."
      );

    key = key.split(/[ ]+/g);

    if(!runtime_command[key[0]]){

      runtime_command[key] = { fn : fn };

      if(key.slice(1)[0])
        runtime_command[key].argv = key.slice(1);
    }
    else if(runtime_command[key])
      throw RuntimeError('Command "'+key+'" already exists.');
      // ^ Don't override if command exists.
      // Throw error so one can see where source code lives.
      // Can save headaches... or maybe annoying, we'll see :D.

  }

  return runtime;
}

exports.createInterface = createInterface;

/*
 * `getRuntime` function
 *
 * - Instantiates a `default` runtime if doesn't exists
 */

function getRuntime(){

  if(!instance)
    instance = createInterface({
      input : process.stdin,
      output : process.stdout,
      completer : completerFn
    });

  return instance;
}

exports.getRuntime = getRuntime;

/*
 * Runtime handle `set` and `get`
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
    throw RuntimeError('Falsey commands like '+key+' are not allowed.');
  else if(typeof key !== 'string')
     throw RuntimeError(
      'Command "'+key+"' should be a `string`."
    );
  else if(typeof fn !== 'function')
    throw RuntimeError(
      'Command "'+key+"' `handle` is not a function."
    );

  key = key.trim().split(/[ ]+/g);

  if(runtime_command[key[0]])
    throw RuntimeError(
      'Command `' + key[0] +'` already exists as a `'
      + this.runtime_name + '` command.'
    );
  else if(!command[key[0]]){

    command[key] = { fn : fn };

    if(key.slice(1)[0])
      command[key].argv = key.slice(1);
  }
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
  else if(key === this.runtime_name)
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

  if(typeof cmd === 'function')
    cmd.call(this, args);
  else
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

  var co = !command[cmd] ? (
    !runtime_command[cmd] ? undefined : runtime_command.fn
  ) : command[cmd].fn;

  var followUp;

  if(this.handle){

    if(typeof this.handle !== 'function')
      throw RuntimeError({
        message : 'Your handle should be a function'
      });
    else
      followUp = this.handle.call(null, cmd, args, next);
  }
  else if(co)
    followUp = co(cmd, args, next);
  else
    return RuntimeWarning.call(this, {
      message : 'Command "'+args.raw[0]+'" not defined.'
    });

  // auto follow up
  if(followUp) next();
  else         this.emit('done', cmd, args, index);

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

  var completions = Object.keys(
    merge(command, runtime_command)
  );

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