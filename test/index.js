
var util = require('../lib/util');
var prettyfy = util.prettyfy
var runtime = require('../lib/runtime').createRuntime('gulp');

console.log('Runtime');
console.log(runtime);
console.log()

runtime.onStartup(function(){
  this.prompt();
})

runtime.set('first', function First(){
  console.log('first!')
}).version('0.0.1')

console.log('  get:',
  runtime.get(),
'\n')