'use strict';

var path = require('path');
var packageName = require('../package').name;

var gulp = require('../');
var util = require('./_util');

describe(packageName, function(){
  util.suite().forEach(function(file){
    var suite = path.basename(file, path.extname(file));
    describe(suite, function(){
      require('./'+file)(gulp, util);
    });
  });
});
