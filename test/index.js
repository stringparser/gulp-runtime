
var prettyfy = require('../util/prettyfy');
var runtime = require('../lib/runtime')('gulp');


runtime.onStartup(function(){
/*  console.log('\n Runtime handlers \n')
  console.log(this._Handle)
  console.log('\n  Startup runtime: \n')
  console.log(this)*/
})

runtime.onStartup(function(){
  console.log('\n Command proposal', this.command('hello'))
  console.log('')
  this.prompt();
})

runtime.set('this', function(){
  console.log(this);
  console.log(arguments)
}).command('that', function(){
  console.log('that')
})