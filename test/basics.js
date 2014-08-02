/*
 * Module dependencies
 */

var should = require('should');
var runtime = require('../lib/runtime').createRuntime('gulp');

runtime.onStartup(function(){
  this.prompt();
})

runtime.set('first', function First(){
  return 'first';
}).version('0.0.1', 'first command');

var command = runtime.get('first');
var test;

test = should.equal('firs', command._name);
test = test && should.equal('0.0.1', command.version.number);
test = test && should.equal('first command', command.version.comment);

if(test)
  process.exit(0);
else
  process.exit(1);