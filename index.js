'use strict';
const FeDevServer = require('./server');
const app = new FeDevServer();

app.get('/', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write('<head><meta charset="utf-8"/></head>');
    res.end('访问了 /');
});
app.get('/start', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write('<head><meta charset="utf-8"/></head>');
    res.end('访问了 /start');
});

app.runServer();