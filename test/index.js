
var env = process.env;
    env.NODE_ENV = env.NODE_ENV || 'dev-test';

var runtime = require('../lib/runtime').createInterface('terminal');

runtime.set('first', function(){
  return 'first!'
}).set('second', function(){
  return 'second!'
}).set('--some-flag', function(){
  return 'whatever'
})

runtime.set('-T', function(){

})

runtime.set('--require', function(){

})

console.log(' `runtime.get()`:\n',
  runtime.get()
)