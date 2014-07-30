/*
 * Module dependencies
 */

var util = require('util');
var readline = require('readline');

var parseCMD = require('../util/parseCMD');
var RuntimeError = require('./runtime-error');

//
// ##
//
exports = module.exports = Interface;

//
// ##
//
function Interface(options){


  if( !(this instanceof Interface) ){
    return new Interface(options);
  }
  else {

    readline.Interface.call(this, options);

    // main events
    this._events = listenOn;

    // empty handle
    this.handle = options.handle ? options.handle : null;

    // completion makes the process crash otherwise
    this.input.on('keypress', function(){})

    // startup event
    this.emit('startup');
  }
}
util.inherits(Interface, readline.Interface);

//
// ##
//

var listenOn = {};

//
// ##
//
listenOn.startup = function(cb){

  if(typeof cb === 'function')
    cb.call(this.handle);
}

//
// ##
//
listenOn.line = function(cmd){

  cmd = cmd.trim();

  if(cmd === '')
    this.emit('done', this.handle);
  else{

    var args = parseCMD(cmd);
    this.emit('next', this.handle, args.argv[0], args, 0);
  }
}

//
// ##
//
listenOn.next = function(cb, cmd, args, index){

  if(cb !== 'function')
    throw RuntimeError({
        message : 'Either the `Interface.handle` is not a function '
                + 'or it does not exist. Provide one'
      });

  var self = this;
  cmd = args.argv[index+1];

  if(cmd)
    cb.call(this.handle, cmd, args, function(){
      self.emit('next', cb, cmd, args, index+1);
    });
  else
    cb.call(this.handle, cmd, args, function(){
      self.emit('done', cb, cmd, args, index+1);
    });


}

//
// ##
//
listenOn.done = function(cb, cmd, args, index){

  if(typeof cb === 'function')
    cb.call(this.handle, cmd, args, next);
  else
    this.handle.prompt();
}