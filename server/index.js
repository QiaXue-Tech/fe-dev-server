'use strict';
const http = require('http');

exports.runServer = () => {
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<head><meta charset="utf-8"/></head>');
        res.end('连接服务器成功！！！');
    });

    server.on('listening', () => {
        console.log('正在监听 8080 端口...');
    });
    
    server.listen(8080);
};