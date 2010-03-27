var items = [];
var itemsMap = {};

/**
 * Adds a item to the stack and registers the id 
 */
exports.push = function(id, item) {
	items.push({id:id, item:item});	
	itemsMap[id]= item;
}

/**
 * returns the last item from the stack 
 */
exports.pop = function(){ 
	var next = items.pop(); 
	var nextId = next.id; 
	var nextItem = next.item;
	delete itemsMap[next.id];
	return nextItem;
}

/**
 * Checks if a entry is in the Map 
 */
exports.exists = function(id) {
	return (typeof itemsMap[id] != 'undefined');
} 



	
