'use strict';

// Module dependencies
var gulp = require('gulp');
var gulpCtor = gulp.__proto__.Gulp;
var gutil = require('gulp-util');
var footer = require('gulp-footer')
var spawn = require('child_process').spawn;

// expose `gulp`
module.exports = gulp;

// helpers
var stdin = process.stdin;
var stdout = process.stdout;
var stderr = process.stderr;
var tasks = gulp.tasks;
var stdioEvents = [
  'error', 'exit', 'close', 'disconnect', 'message'
];

// set encoding
stdin.setEncoding('utf8');
stdout.setEncoding('utf8');

stdin.on('data', function(data){

  var argv = data.trim().replace(/[ ]+/g, ' ').split(' ');
  var spawn = false;
  // give preference gulp cli
  if(data[0] === '-')
    spawn = true;
  else if(tasks[argv[0]])
    spawn = true;
  else
    prompt(arguments);

  if(spawn)
    spawnedGulp(argv);
})

//
// propmt printer
gulp.on('task_start', function(){
    prompt('task_stop', gulp);
  }).on('task_err', function(){
    prompt('task_err', gulp)
  }).on('task_not_found', function(){
    prompt('task_not_found', gulp);
  })


//
// Handlers

function prompt(e, fn){

  if(typeof e === 'string' && fn && fn.on)
    fn.once(e, function(){
      console.log('event : '+e);
      stdout.write(' > gulp ');
    });
  else {
    console.log('else prompts', arguments)
    stdout.write(' > gulp ');
  }
}

function spawnedGulp(argv){

  gutil.log('spawned gulp started', argv)
  var child = spawn('gulp', argv, {
    stdio : 'inherit'
  });

  child.unref();
}

stdout.on('finish', function(){
  console.log('finished')
})

