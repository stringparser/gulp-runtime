'use strict';

module.exports = {
  lib: require('../lib/util'),
  mkdirp: require('mkdirp'),
  rimraf: require('rimraf'),
  through: require('through2'),
  content: 'exports = module.exports = {}',
  testModule: 'test/dir/module.js',
  contentChanged: 'exports = module.exports = {content: \'changed\'}'
};
