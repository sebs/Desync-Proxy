var items = [];
var itemsMap = {};


exports.add = function(id, item) {
	items.push({id:id, item:item});	
	itemsMap.id = item;
}

exports.getNext = function(){ 
	var next = items.pop; 
	var nextId = next.id; 
	var nextItem = next.item;
	
	return nextItem;
}






