'use strict';

require('should');


var Gulp = require('../');
var util = require('./util');

util.lib.log = function () {
  // disable logging for tests
};

var tests = [
  'create.js',
  'task.js',
  'cli.js',
  'watch.js'
];

describe(require('../package').name, function () {
  var path = require('path');

  tests.forEach(function (file) {
    var suite = path.basename(file, path.extname(file));
    describe(suite, function () {
      require('./' + file)(Gulp, util);
    });
  });
});
