/*
 * Module dependencies
 */
var terminal = require('../terminal');
var Warning = require('./warning');

module.exports = function defaultConsumer(argv, args, command){

  var command = command || this.get(argv);

  var nextFired = false;
  if(command.handle){

    var scope  = this.config.scope;

    command.handle.call(
      scope ? require(scope) : this, argv, args, function(){
      nextFired = true;
    });
    argv = argv.slice(command._depth);
  }

/*  console.log('\n Consumers says: "ñam, ñam, ñam! ... "')
  console.log('\n   argv = ', argv, '\n')
  console.log('  chewing = \n',command);
  console.log('')*/

  var xInterface = terminal.getInterface();
  var root = this.get();
  var command = this.get(argv);

  var notCommand = !(
    argv[0]
    && argv[0][0] !== '.'
    && root.completion.indexOf(argv[0]) === -1
  )

  if(argv[0] && command._parent !== command._name){

/*    console.log('\n followUp = \n', this.get(argv));
    console.log('\n argv = ', argv, '\n');*/

    xInterface.emit('next', argv, args, command);

  }
  else if ( notCommand ){

    if(argv[0]){
      Warning(' command `'+argv[0]+'` not found');
    }
    xInterface.emit('done', argv, args);
  }
  else {
    xInterface.emit('done', argv, args);
  }
}