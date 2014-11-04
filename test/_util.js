'use strict';

var fs = require('fs');

module.exports = {
  testSuite : function(){
    var testSuite = fs.readdirSync(__dirname);
    // in case there is priority
    var testFirst = [
      'startup.js'
    ];

    // omit things starting with underscore
    testSuite = testSuite.filter(function(thing){
      return testFirst.indexOf(thing) < 0 && !thing.match(/^_/);
    });
    testSuite.unshift.apply(testSuite, testFirst);
    return testSuite;
  }
};
