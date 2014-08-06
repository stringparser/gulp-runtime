
var env = process.env;
    env.NODE_ENV = env.NODE_ENV || 'dev-test';

var runtime = require('../lib/runtime').Runtime('terminal2');

runtime.set('first', function(){
  return 'first!'
}).set('second', function(){
  return 'second!'
}).set('--some-flag', function(){
  return 'whatever'
})


process.stdin.end();