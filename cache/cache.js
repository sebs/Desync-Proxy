/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var cache = exports;
var cacheData = {};
var cacheAge = {};


/**
 * Adds a Entry to the cache
 */
exports.add = function(id, value) {
    now = new Date();
    cacheData[id] = value;
    cacheAge[id] = now.getTime();
}

/**
 * returns a Cache result
 */
exports.get = function(id) {
    return cacheData[id];
}

/**
 * Checks if a cache entry is set
 */
exports.exists = function(id) {
    return (typeof cacheData[id] != 'undefined')
}

/**
 * Removes a cache entry
 */
exports.remove = function(id) {
    if (cache.exists(id)) {
        delete cacheData[id];
        delete cacheAge[id];
    }
}
/**
 * Return Statistics from cache
 */
exports.stats = function() {
    var count = 0;

    var min = 0;
    var max = 0;

    // iterate over the cache
    for(var i in cacheData) {
        // special handling
        if (count == 0) {
            min = cacheAge[i];
            max = cacheAge[i];
        } else {
            if (cacheAge[i] < min) {
                min = cacheAge[i];
            }

            if (cacheAge[i] > max) {
                max = cacheAge[i];
            }
        }
        count++;
    }
    return {count: count, min:min, max:max }
}
