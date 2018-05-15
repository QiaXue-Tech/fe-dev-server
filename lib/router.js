const url = require('url');
const http = require('http');
const querystring = require('querystring');
class FeDevRouter {
    constructor() {
        this.proxyTable = {};
    }

    /**
     * 
     * @param {Object} handle 
     * @param {String} pathName 请求地址
     * @param {ServerResponse} response 
     * @param {IncomingMessage} request 
     */
    route(handle, pathName, response, request) {
        const self= this;
        pathName.lastIndexOf('.')
        /**
         * @type {Function}
         */
        const action = handle[pathName].callback;
        /**
         * @type {String}
         */
        const method = handle[pathName].method.toLowerCase();
        
        if (typeof action === 'function' && method === request.method.toLowerCase()) {
            switch(method) {
                case 'get':
                    self.getRequest(action, pathName, request, response);
                    break;
                case 'post':
                    self.postRequest(action,pathName ,request, response);
                    break;
                default:
                    break;
            }
        } else {
            res.setHeader('Content-Type','text/html;charset=utf-8');
            response.writeHead(404);
            response.end('404 Not Found!');
        }
    }

    /**
     * 处理 get 请求
     * @param {Function} action 
     * @param {String} pathName 
     * @param {*} request 
     * @param {*} response 
     */
    getRequest(action, pathName, request, response) {
        const self = this;
        const params = url.parse(request.url, true).query;
        const proxyKey = pathName.split('/')[1];
        if (self.proxyTable[proxyKey]) {
            // https://www.cnblogs.com/gamedaybyday/p/6637933.html
            const options = self.setRequestOptions('get', proxyKey, pathName, params);
            let req = http.request(options, (res) => {
                res.on('data', (chunk) => {
                    action(request, response, chunk, null);
                });
                res.on('error', (error) => {
                    action(request, response, null, error);
                });
            });
            req.end();
            return;
        }
        request.params = params;
        action(request, response);
    }

    /**
     * 处理 post 请求
     * @param {Function} action 
     * @param {String} pathName 
     * @param {*} request 
     * @param {*} response 
     */
    postRequest(action, pathName, request, response) {
        // https://blog.csdn.net/u013263917/article/details/78682270
        const self = this;
        let data = '';
        const proxyKey = pathName.split('/')[1];
        request.on('data', (chunk) => {
            data += chunk;
        });
        request.on('end', () => {
            data = decodeURI(data);
            const params = querystring.parse(data);

            if (self.proxyTable[proxyKey]) {
                // https://www.cnblogs.com/gamedaybyday/p/6637933.html
                const options = self.setRequestOptions('post', proxyKey, pathName, params);
                let req = http.request(options, (res) => {
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        action(request, response, chunk, null);
                    });
                    res.on('error', (error) => {
                        action(request, response, null, error);
                    });
                });
                req.write(querystring.stringify(params));
                req.end();
                return;
            }

            request.params = params;
            action(request, response);
        });
    }

    /**
     * 
     * @param {String} method 
     * @param {String} proxyKey 
     * @param {String} pathName 
     */
    setRequestOptions(method, proxyKey, pathName, params) {
        const self = this;
        let pathArr = pathName.split('/');
        pathArr.splice(1,1);
        pathName = pathArr.join('/');
        let content = querystring.stringify(params);
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': content.length
        };
        const options = {
            method: method.toUpperCase(),
            hostname: self.proxyTable[proxyKey].host,
            port: self.proxyTable[proxyKey].port,
            path: method === 'get' ? `${pathName}?${content}` : pathName
        };
        if (method === 'post') {
            options.headers = headers;
        }
        return options;
    }
}

module.exports = new FeDevRouter();