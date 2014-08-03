/*
 * Module dependencies
 */
var onDT = require('../util').onDT;

/*
 * Expose the `terminal` events
 */

var terminalOn = exports = module.exports = {};

/*
 * doc holder
 */
terminalOn.line = function(cmd){

  cmd = cmd.trim();

  if(cmd === '')
    this.emit('done');
  else {

    var args = this.parser(cmd);

    this.emit('next', args.raw[0], args, 0);
  }
}

/*
 * doc holder
 */
terminalOn.next = function(cmd, args, index){

  cmd = args.argv[index];

  if(cmd){

    onDT(function(){
      console.log(' [%s] is next', cmd)
    });

    this.terminal(cmd, args, function(){
      this.emit('next', cmd, args, index+1);
    });
  }
  else
    this.emit('done', args.argv[index-1], args, index);

}

/*
 * doc holder
 */
terminalOn.done = function(cmd, args, index){

  onDT(function(){

    if(cmd)
      console.log(' [%s] done', cmd);
    else
      console.log(' [] done');
  })

  this.prompt();
}