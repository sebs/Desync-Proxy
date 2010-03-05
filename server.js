var sys = require('sys'), posix = require("posix"), http = require('http'), fuzzy = require('./logic');


/*
 * Checks Arguments
 */
var checkArgs = function(path, arguments) {
    return true;
}


http.createServer(function (req, res) {

    // sys.puts(JSON.stringify(req.uri));
    var result = fuzzy.grade('0.2', 0, 1);


    switch (req.uri.path) {
        case '/fuzzy':

            break;


        case '/reverseGrade':

            break;

        case '/triangle':

            break;
        case '/trapezoid':

            break;
        default:
            res.sendHeader(404, {'Content-Type': 'text/plain'});
            res.sendBody('Method not found');
            res.finish();
    }



    res.sendHeader(200, {'Content-Type': 'text/plain'});
    res.sendBody(JSON.stringify({'result' : result, 'method': req.uri.path}));
    res.finish();
}).listen(8000);

sys.puts('Server running at http://127.0.0.1:8000/');


