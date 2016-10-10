"use strict";

var http = require('http');
var serveStatic = require('serve-static');
var finalHandler = require('finalhandler');
var start = function start(dir) {
    var final = finalHandler;
    var serve = serveStatic(dir);
    var server = http.createServer(function (req, res) {
        serve(req, res, final(req, res));
    });
    var port = typeof process.env.PORT === 'undefined' ? 80 : parseInt(process.env.PORT, 10);
    server.listen(port);
    return new Promise(function (resolve) {
        server.on('close', function () {
            return resolve();
        });
    });
};
exports.start = start;