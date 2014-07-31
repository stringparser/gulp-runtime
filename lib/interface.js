/*
 * Module dependencies
 */

var util = require('util');
var readline = require('readline');
var RuntimeError = require('./runtime-error');

var parseCMD = require('../util/parseCMD');
var prettyfy = require('../util/prettyfy');

/*
 * doc holder
 */
exports = module.exports = Interface;

/*
 * doc holder
 */
function Interface(options){


  if( !(this instanceof Interface) ){
    return new Interface(options);
  }
  else {

    readline.Interface.call(this, options);

    // main events
    this._events = listenOn;

    // fill in the handle
    this.handle = options.handle ?
      options.handle : function(){ return null; };

    // completion makes the process crash otherwise
    this.input.on('keypress', function(){})
  }
}
util.inherits(Interface, readline.Interface);

/*
 * doc holder
 */

var listenOn = {};

/*
 * doc holder
 */
listenOn.line = function(cmd){

  cmd = cmd.trim();

  if(cmd === '')
    this.emit('done');
  else{

    this._done = false;

    var args = parseCMD(cmd);
    this.emit('next', args.argv[0], args, 0);
  }
}

/*
 * doc holder
 */
listenOn.next = function(cmd, args, index){

  cmd = args.argv[index];

  if(cmd){
    console.log('next with "%s"', cmd)
    this.handle(cmd, args, function(){
      this.emit('next', cmd, args, index+1);
    });
  }
  else
    this.emit('done', args.argv[index-1], args, index);

}

/*
 * doc holder
 */
listenOn.done = function(cmd, args, index){

  console.log('\ndone with "%s"', cmd)
  this.prompt();
}