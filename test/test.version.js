/*
 * Module dependencies
 */
var should = require('should');
var runtime = require('../lib/runtime').createRuntime('gulp');

runtime.onStartup(function(){
  this.prompt();
})

runtime.set('first', function First(){
  return ['first!!'];
}).version('0.0.1', 'first command');

var command = runtime.get('first');
var version = command.version;

  command
    .should.have.property('_name', 'first');

  (command.fn()[0])
    .should.be.exactly('first!!')
    .and.be.a.String;

  (version.number)
    .should.equal('0.0.1')
    .and.be.a.String;

  (version.comment)
    .should.equal('first command')
    .and.be.a.String;

//
// if we arrived where should.be.ok :)
// stdin will wait otherwise
//
process.stdin.end();