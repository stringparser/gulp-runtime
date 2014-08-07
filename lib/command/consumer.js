/*
 * Module dependencies
 */
var terminal = require('../terminal');
var Warning = require('./warning');

module.exports = function defaultConsumer(argv, args, command){

  var command = command || this.get(argv);

  if(command.handle){

    var scope  = this.config.scope;
    command.handle.call(scope ? require(scope) : this, argv, args);

    // consume the arguments
    argv = argv.filter(function(arg){
      return command.completion.indexOf(arg) === -1;
    });
  }

  var xInterface = terminal.getInterface();
  var command = this.get(argv);

  if(command.completion.indexOf(argv[0]) !== -1){

    xInterface.emit('next', argv, args, command);

  }
  else if( argv[0] ){

    Warning(' command `'+argv[0]+'` not found');
  }
}
