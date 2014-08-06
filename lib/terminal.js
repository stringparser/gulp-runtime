
/*
 * Module dependencies
 */

var util = require('./utils');
var readline = require('readline');
var merge = util.merge;

/*
 * The default `Runtime` handle
 */

var xRuntime = {
  lexer : require('./command/lexer'),
  parser : require('./command/parser'),
  consumer : require('./command/consumer'),
  completer : require('./command/completer')
};

/*
 * the runtime interface
 */

var xInterface = {
      input : process.stdin,
     output : process.stdout,
  completer : function(line){
    return getRuntime().completer(line);
  }
};

var xInterface = new readline.Interface(xInterface);

/*
 *
 */

xInterface.on('line', function(line){

  line = line.trim();
  if(line === ''){
    this.emit('done');
  }
  else {

    var runtime = getRuntime();
    var argv = runtime.lexer(line);
    var args = runtime.parser(line);

    this.emit('next', argv, args);
  }
});

/*
 *
 */

xInterface.on('next', function(argv, args, command){

  getRuntime().consumer(argv, args, command);
});

/*
 *
 */

xInterface.on('done', function(line, args, index){
  
  this.prompt();
});


/*
 * Module exports
 */

exports = module.exports;

/*
 *
 */

function getInterface(name){

  if(!name)
    return xInterface;
  else
    return xInterface[name];
}
exports.getInterface = getInterface;

/*
 *
 */

function getDefaults(){

  var target = merge({}, xRuntime);
  return target;
}
exports.getDefaults = getDefaults;

/*
 *
 */

var runtime;
function setRuntime(handle){

  if( util.isUndefined(handle) ){
    throw new Error(' Provide a handle to set.');
  }
  else
    runtime = handle;
}
exports.setRuntime = setRuntime;

/*
 *
 */

function getRuntime(){

  if(util.isUndefined(runtime)){
    var target = merge({}, xRuntime);
    return target;
  }
  else {
    return runtime;
  }
}
exports.getRuntime = getRuntime;
