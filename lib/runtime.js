
/*
 * Module dependencies
 */
 var merge = require('utils-merge');
 var proto = require('./proto');

exports = module.exports = createRuntime;


function createRuntime(){

  var runtime = function(name, cb){
      runtime.handle(name, cb);
  }

  merge(runtime, proto);

  return runtime;

}