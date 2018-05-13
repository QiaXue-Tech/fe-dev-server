'use strict';
const FeDevServer = require('../server');
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

app.post('/api/banner',(req, res, data, err) => {
   if(err) {
       console.error(err);
   } 
   res.end(data);
});

app.post('/user', (req, res)=>{
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write('<head><meta charset="utf-8"/></head>');
    res.end('访问了 /user');
})

app.renderView('/index', '/views/index.html');

app.runServer();