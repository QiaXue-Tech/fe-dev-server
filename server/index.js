'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs');
const router = require('../routes');
class FeDevServer {
    constructor() {
        this.handle = {};
        this.router = router;
    }

    /**
     * 启动服务器
     * @param {Number} port 端口号默认8080
     * @param {Function} callback 回调函数
     */
    runServer(port, callback, handle) {
        const self = this;

        if (isNaN(Number(port))) {
            callback = port;
        }

        if (typeof callback !== 'function') {
            callback = null;
        }

        const server = http.createServer((req, res) => {
            const pathName = url.parse(req.url).pathname;
            if (pathName === '/favicon.ico') {
                res.writeHead(200);
                res.end();
                return;
            }
            self.router.route(self.handle, pathName, res, req);
        });

        server.listen(Number(port) || 8080, callback);
    }

    /**
     * 注册 Post 请求
     * @param {String} pathName 请求地址
     * @param {Function} callback 回调函数
     */
    post(pathName, callback) {
        const self = this;
        self.handle[pathName] = {
            method: 'post',
            callback: callback
        };
    }

    /**
     * 注册 Get 请求
     * @param {String} pathName 请求地址
     * @param {Function} callback 回调函数
     */
    get(pathName, callback) {
        const self = this;
        self.handle[pathName] = {
            method: 'get',
            callback: callback
        };
    }

    /**
     * 加载页面
     * @param {String} pathName 请求地址
     * @param {String} viewPath 视图路径
     */
    renderView(pathName, viewPath) {
        const self = this;
        self.handle[pathName] = {
            method: 'get',
            callback: (req, res) => {
                res.setHeader('Content-Type','text/html;charset=utf-8');
                fs.readFile(`.${viewPath}`, (err, data) => {
                    if(err) {
                        res.writeHead(404);
                        res.end();
                    }

                    res.end(data);
                });
            }
        };
    }
}

module.exports = FeDevServer;