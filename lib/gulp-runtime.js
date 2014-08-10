
var gulp = require('gulp');
var gutil = require('gulp-util');
var chalk = gutil.colors;

var runtime = module.exports = (
  new require('runtime').createInterface('gulp')
);

runtime({ env : process.env });
runtime.require('./gulp-cli');