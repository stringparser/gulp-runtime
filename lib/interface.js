/*
 * Module dependencies
 *
 * NOTE:
 *  - Variables/properties starting with "x" are refs.
 *    The above is just a convention to say that "yes"
 *    the `ref` value is manipulated on other module.
 *    Usually with a [Getter].
 */

var readline = require('readline');

/*
 * Make a new `xInterface`
 */
var xInterface = new readline.Interface({
   input : process.stdin,
  output : process.stdout
});


/*
 * Listen on only one `line` event
 */

xInterface.on('line', function(command){
  xInterface.xHandle.emit('line', command);
});

/*
 * Completion fails otherwise
 */
xInterface.input.on('keypress', function(str, key){
  xInterface.xHandle.emit('keypress', str, key);
});

/*
 * Expose an `Interface` instance
 *
 * ## Note: require caches module loads
 *    so in the end we only have one
 *    instance with this approach.
 *
 *    For now this solves `duplicate
 *    input from stdin` problem.
 */
exports = module.exports = xInterface;

