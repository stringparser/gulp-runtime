'use strict';
/**
 *
 */

module.exports = logTasksSimple;

function logTasksSimple(env, localGulp) {
  console.log(
    Object.keys(localGulp.tasks)
      .join('\n').trim()
  );
}
