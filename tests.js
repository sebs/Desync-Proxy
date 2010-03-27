var assert = require('assert');
var stack = require('./stack/stack');
var config = require('./config');
var cache  = require('./cache/cache');
/**
 * Stack Tests 
 */

var item = {foo:'foo'};
stack.push('myid', item);
var hasId = stack.exists('myid');
assert.ok(hasId);
assert.equal(false, stack.exists('idontknowu'));

var element = stack.pop();
assert.equal(false, stack.exists('myid'));
assert.deepEqual(element, item);

/**
 * Config Tests
 */
assert.ok(typeof config.host != 'undefined');
assert.ok(typeof config.concurrency != 'undefined');
assert.ok(typeof config.endpoint != 'undefined');
assert.ok(typeof config.lifetime != 'undefined');


/**
 * cache Tests
 */
cache.add('myid', item);
var res = cache.exists('myid');
assert.ok(res);
var cachedElement = cache.get('myid');
assert.deepEqual(cachedElement, item);
var age = cache.getAge('myid');
assert.ok(isNaN(age) == false);
assert.ok(cache.exists('myid'));
