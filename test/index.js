
var prettyfy = require('../util/prettyfy');
var runtime = require('../lib/runtime')('gulp');

runtime.onStartup(function(){
  this.prompt();
})

runtime.set('first', function First(){
  console.log('first!')
}).set('second', function Second(){
  console.log('hello')
})


