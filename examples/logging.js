'use strict';

var MyGulp = require('../.').createClass({
  onHandleEnd: function (task) {
    console.log('end', task.label);
  },
  onHandleStart: function (task) {
    console.log('start', task.label);
  },
  onHandleError: function (error, task, stack) {
    console.log('from', stack.tree().label);
    console.log('error!', task.label);
    throw error;
  }
});

var myGulp = MyGulp.create({
  onHandleStart: function (task) {
    console.log(task.label, 'ended!');
  }
});

myGulp.task(':name', function (done) {
  if (this.params && this.params.name === 'three') {
    throw new Error('ups, something broke');
  } else {
    setTimeout(done, 1000);
  }
});

myGulp.stack('one', 'two', 'three', {
  onHandleError: function (error, task) {
    console.log(task.label, 'is dead');
    console.log(error);
  }
})();
