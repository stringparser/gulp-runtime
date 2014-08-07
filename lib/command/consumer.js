/*
 * Module dependencies
 */
var terminal = require('../terminal');
var Warning = require('./warning');

module.exports = function defaultConsumer(argv, args, command){

  var root = this.get();
  var command = command || this.get(argv);

  if(command.handle){

    var scope  = this.config.scope;
    command.handle.call(scope ? require(scope) : this, argv, args);

    // ""ñam, ñam, ñam..." consume the arguments
    argv = argv.filter(function(arg){
      return root.completion.indexOf(arg) === -1;
    });

    if(argv[0]){
      argv = argv.filter(function(arg){
        return command.completion.indexOf(arg) === -1;
      })
    }
  }

  if(command.completion.indexOf(argv[0]) !== -1){

    terminal.getInterface().emit('next', argv, args, this.get(argv));
  }
  else if(argv[0]){

    Warning(' command `'+argv[0]+'` not found');
    this.prompt();
  }
  else
    this.prompt();
}
