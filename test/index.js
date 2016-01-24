'use strict';

var path = require('path');

var Gulp = require('../');
var util = require('./util');

var tests = [
  'create.js',
  'task.js'
];

describe(require('../package').name, function(){
  tests.forEach(function(file){
    var suite = path.basename(file, path.extname(file));
    describe(suite, function(){
      require('./' + file)(Gulp, util);
    });
  });
});
