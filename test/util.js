'use strict';

module.exports = {
  lib: require('../lib/util'),
  mkdirp: require('mkdirp'),
  rimraf: require('rimraf'),
  through: require('through2'),
  content: 'exports = module.exports = {}',
  testFile: 'test/dir/watch.js',
  testModule: 'test/dir/module.js',
  contentChanged: 'exports = module.exports = {content: \'changed\'}'
};
