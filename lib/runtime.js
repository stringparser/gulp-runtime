/*
 * Module dependencies
 */

var util = require('util');
var merge = require('utils-merge');
var readline = require('readline');
var parseCMD = require('../util/parseCMD');
var RuntimeError = require('./runtime-error');

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

var instance;

function Runtime(options){

  if ( !(this instanceof Runtime) ){
    instance = new Runtime(options);
    return instance;
  }
  else if( instance )
    return instance;
  else {

    // attach the readline Interface
    Interface.call(this, options)

    // wire up events
    this._events = listen;
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
var command = {};

/*
 * Runtime set:
 *  - set a command `key` to run a function
 */

Runtime.prototype.set = function (key, fn){

  var err;
  if(typeof fn !== 'function')
    throw new Error(
      fn + ' is not a function.'
      + ' You need one to set a command.'
    );

  key = (key).toString();

  if( key.trim()[0] === '-')
    throw new Error(
      'Flags (commands starting with "-") are not allowed.\n' +
      'Since they can be used by `' + instance.runtime_name + '` itself.'
    );
  else if(!command[key])
    return command[key] = fn;
  else if(command[key])
    throw new Error('Command "'+key+'" already exists.');
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

  if(command[key])
    return command[key];
  else if(typeof key === 'undefined')
    return Object.keys(command);
    // > Helper to see all commands
  else
    return false;
}

/*
 * Runtime `handle`:
 *  - called before firing `next`/`done` events.
 *
 */

/*
 * Event handlers for the Interface instance
 *
 *  - `listen` variable holds the Instance events.
 *  - There is only one runtime Instance.
 *  - event's are dispached based on the first argument
 */
var listen = {};

/*
 * handle `line` events
 */
listen.line = function(cmd){

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
listen.next = function(cmd, args, index){

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
listen.done = function(cmd, index, args){
  this.prompt();
}

/*
 * Runtime `handle`:
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

  if(this.handle){

    if(typeof this.handle !== 'function')
      throw new Error('Your handle should be a function');
    else
      this.handle.call(null, cmd, args, next);
  }
  else if(typeof command === 'function')
    command(cmd, args, next);


  var self = this;
  //
  // ## Similar to express's next
  //    you have to call it in order to
  //    continue
  function next(){
    callback.call(self);
  }
}