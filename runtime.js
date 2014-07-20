'use strict';

// Module dependencies
var gulp = require('gulp')
  , gutil = require('gulp-util')
  , spawn = require('child_process').spawn
  , plumber = require('sculpt');

// gulp runtime mods
var gulp = require('./gulp-instance')(gulp);

// expose `gulp`
module.exports = gulp;

// helpers
var stdin = process.stdin
  , stdout = process.stdout
  , stderr = process.stderr
  , tasks = gulp.tasks
  , promptText = require('./util').promptText;

// set encoding
stdin.setEncoding('utf8');

// pipes!
stdin.pipe(
  plumber.filter(manager)
).pipe(stdout);

// runtime manager
function manager(chunk){

  var argv = chunk.trim().replace(/[ ]+/g, ' ');
  var filter = true;

  if(argv[0] === '-')
    childGulp(argv);
  else if(tasks[argv[0]])
    chunk = JSON.stringify(task[argv[0]], null, '\t');
  else
    filter = false;

  return filter ? '' : chunk;
}

function childGulp(argv){

  argv = argv.split(' ');

  // maintain default '--color'
  if(argv[0] !== '--color' && argv[0] !== '--no-color')
    argv.unshift('--color');

  stdout.write('\n Child gulp started '+ JSON.stringify(argv) + '\n\n');
  var child = spawn('gulp', argv);

  child.stdin.end();

  // Handle output
  child.stdout.on('data', function(chunk){
    stdout.write(chunk)
  }).on('end', function(){
    stdout.write(promptText);
    child.kill();
  })
}