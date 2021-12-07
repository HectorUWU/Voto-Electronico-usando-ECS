const http = require('http');

http.createServer(function(req, res) {
    res.writeHead(200, { 'content-type': 'text/plain' });
    res.end('Howola');
}).listen(20000);