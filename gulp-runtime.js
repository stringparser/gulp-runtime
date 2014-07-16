'use strict';

// Module dependencies
var gulp = require('gulp');
var gutil = require('gulp-util');
var child = require('child_process');

// helpers
var stdin = process.stdin;
var stdout = process.stdout;
var stderr = process.stderr;

// go to `old` stream mode
// and set encoding
stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function(data){

  if(data[0] === '-'){
    data = data.trim().replace(/[ ]+/g, ' ').split(' ');
    stdin.pipe(spawnedGulp(data));
  }
  else
    gutil.log('> command');
})

stdin.on('end', function(data){

  gutil.log('>');
})

function spawnedGulp(data){
  return child.spawn('gulp', data, {
    stdio : 'inherit'
  });
}