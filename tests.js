var assert = require('assert');
var stack = require('./stack/stack');

var item = {foo:'foo'};
stack.push('myid', item);
var hasId = stack.exists('myid');
assert.ok(hasId);
assert.equal(false, stack.exists('idontknowu'));

var element = stack.pop();
assert.equal(false, stack.exists('myid'));
assert.deepEqual(element, item);
