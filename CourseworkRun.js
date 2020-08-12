var http = require('http');
var url = require('url');
const util=require('util');
const serverModules=require('./CourseworkModules');

http.createServer(function(req,res){
// normalize url by removing querystring, optional
// trailing slash, and making it lowercase
console.log("url"+req.url);

console.log(url.parse(req.url,true));
var path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
console.log("path="+path);

switch(path) {
    case '':
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Homepage');
        break;
    case '/about':
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(serverModules.getInfo());
        break;
    case '/read':
        res.writeHead(200, { 'Content-Type': 'text/plain'});
        res.end(serverModules.readFile());
        break;
    case '/image':
        res.writeHead(200, { 'Content-Type': 'image/jpg'});
        res.end(serverModules.showImage());
        break;
    case '/video':
        res.writeHead(200, { 'Content-Type': 'video/mpeg'});
        res.end(serverModules.showVideo());
        break;
    default:
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        break;
}
}).listen(3001);
console.log('Server started on localhost:3001; press Ctrl-C to terminate....');
