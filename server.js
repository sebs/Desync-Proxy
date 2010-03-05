var sys = require('sys'), posix = require("fs"), http = require('http');
// cache object to store results
var cache = require('./cache');
var notFound = {};

var connections = 0;

// stack managing the ids to request
var stack = [];
// objekt fuer singlecheck
var stackSingle ={};

http.createServer(function (req, res) {

    var path = req.uri.path;

    switch (path) {
        case '/connections':
            sendBody(200, JSON.stringify(connections), res);
            break;
        case '/cache':
            sendBody(200, JSON.stringify(cache.stats()), res);
            break;
        case '/debug':
             var stats = {
                 process: {
                     env:       process.ENV,
                     memory:    process.memoryUsage(),
                     pid:       process.pid
                 },
                 cache: cache.stats(),
                 connections: connections
             }
             sendBody(200, JSON.stringify(stats), res);
            break;
        default:
            // check if we have a argument
            if (typeof req.uri.params.id == 'undefined') {
                res.sendHeader(500, {'Content-Type': 'text/plain'});
                res.sendBody('no input given');
                res.finish();
            }
            var id = req.uri.params.id;

            // Error Cases
            if (typeof notFound[id] != 'undefined') {
                workStack();
                sendBody(404, 'not found', res);
                return;
            }

            sys.puts('connections:' + connections + ' stack:' + stack.length);

            // we have a result, so 200 the client and send the result
            if (cache.exists(id)) {
                workStack();
                sendBody(200, cache.get(id), res);
                return;
            } else {
                // push the data ontop of the stack
                addToStack(id);
                workStack();
            }
            // and send the body
            sendBody(202, 'no result', res);
    }

}).listen(8000);


var addToStack = function(id) {
    if  (typeof stackSingle[id] != 'undefined') {
        return;
    }
    stackSingle[id] = true;
    stack.push(id);
}


var getFromStack = function() {
    var loadId = stack.pop();
    delete stackSingle[loadId];
    return loadId;
}

var workStack = function() {
    if (connections < 20 && stack.length > 0) {
        var loadId = getFromStack();
        // load the data
        getData(loadId);
    }
}

/**
 * Sends the body and finishes the request
 */
var sendBody  = function(status, body, res) {
    res.sendHeader(status, {'Content-Type': 'text/plain'});
    res.sendBody(body);
    res.finish();
}

/**
 * Request the data from the merchantengine Server
 */
var getData = function(id) {
    if (connections >= 20) {
	return;
	}
    // create a new client
    var google = http.createClient(80, "127.0.0.1");
    // doing a request
    var request = google.request("GET", "/service/product.php?id="+id, {"host": "127.0.0.1"});
    connections++;
    // finish the request to the
    request.finish(function (response) {
        // sys.puts("STATUS: " + response.statusCode);
        // sys.puts("HEADERS: " + JSON.stringify(response.headers));
        
        response.setBodyEncoding("utf8");
        response.addListener("body", function (chunk) {
            if (response.statusCode != 404 && response.statusCode != 200) {
                sys.puts('500 service error');
		connections--;
                sendBody(500, 'internal server error', res);
                return;
            }
            // check if a 404 was delivered
            if (response.statusCode == 404) {
                notFound[id] = true;
		connections--;
                return;
            }
            // sys.puts(JSON.stringify(response));
            // sys.puts("BODY: " + chunk);
            cache.add(id, chunk);
            connections--;
        });
    });
}







