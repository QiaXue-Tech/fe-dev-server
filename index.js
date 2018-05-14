'use strict';
const http = require('http');
const url = require('url');
const fs = require('fs');
const router = require('./lib/router');
const fileType = require('./lib/config/filetype');
class FeDevServer {
    constructor() {
        this.handle = {};
        this.router = router;
        this.indexPage = '';
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

        /**
         * 处理静态资源
         * @param {String} pathName 
         * @param {ServerResponse} response 
         */
        const getStaticResource = (pathName, response) => {
            const self = this;
            const suffixIndex = pathName.lastIndexOf('.');
            if (suffixIndex > 0) {
                const suffix = pathName.substring(suffixIndex);
                const contentType = fileType[suffix];
                const buffer = fs.readFileSync(`.${pathName}`);
                response.writeHead(200, {
                    'Content-Type': contentType
                });
                response.end(buffer);
                return true;
            }
            return false;
        };


        const server = http.createServer((req, res) => {
            const pathName = url.parse(req.url).pathname;
            if (pathName === '/favicon.ico') {
                res.writeHead(200);
                res.end();
                return;
            }

            if (pathName === '/') {
                res.setHeader('Content-Type','text/html;charset=utf-8');
                fs.readFile(self.indexPage || `./index.html`, (err, data) => {
                    if(err) {
                        res.writeHead(404);
                        res.end();
                        return;
                    }

                    res.end(data);
                });
                return;
            }

            if(getStaticResource(pathName, res)) {
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
                        return;
                    }

                    res.end(data);
                });
            }
        };
    }
}

module.exports = FeDevServer;