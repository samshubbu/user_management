var express = require('express');
var http = require('http');
var app = express();

var server =http.createServer(app);
server.listen(3000, '127.0.0.1', function(){
    server.close(function(){
        server.listen(3001, '192.168.43.191');
    });
    //console.log("SERVER-----CONNECTED=====<>>>>>>>");
});
//var server = http.createServer(function(req, res){
//    res.writeHead(200, {'content-type': 'text/plain'});
//    res.write("<html><body><p>HTTP -----SERVER=====</p></body></html>")
//    res.end('It works');
//}).listen(3000, function(){
//    console.log("SERVER-----CONNECTED=====<>>>>>>>");
//});

