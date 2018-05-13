'use strict';
const http = require('http');
const url = require('url');
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
            handle = callback;
            callback = null;
        }

        if (Object.prototype.toString.call(handle) !== '[object Object]') {
            handle = {};
        }

        const server = http.createServer((req, res) => {
            const pathName = url.parse(req.url).pathname;
            if (pathName === '/favicon.ico') {
                res.writeHead(200);
                res.end();
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
}

module.exports = FeDevServer;