'use strict';

exports = module.exports = logTasksSimple;

function logTasksSimple(app) {
  console.log(
    Object.keys(app.store.children).join('\n').trim()
  );
}
