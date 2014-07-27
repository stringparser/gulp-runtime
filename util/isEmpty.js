

//
// checks for emptyness similar to
// underscore's only diference the last return.

module.exports = function isEmpty(obj){

  if(obj === null || obj === undefined)
    return true;
  if( Array.isArray(obj) || typeof obj === 'string')
    return obj.length === 0;

  return Object.getOwnPropertyNames(obj).length === 0;
}