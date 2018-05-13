const url = require('url');
const querystring = require('querystring');
class FeDevRouter {
    constructor() {
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
                    self.getRequest(action, request, response);
                    break;
                case 'post':
                    self.postRequest(action, request, response);
                    break;
                default:
                    break;
            }
        } else {
            response.writeHead(404, {
                'Content-Type': 'text/html'
            });
            response.write('<head><meta charset="utf-8"/></head>');
            response.end('404 Not Found!');
        }
    }

    /**
     * 处理 get 请求
     * @param {Function} action 
     * @param {*} request 
     * @param {*} response 
     */
    getRequest(action, request, response) {
        const self = this;
        const params = url.parse(request.url, true).query;
        request.params = params;
        action(request, response);
    }

    /**
     * 处理 post 请求
     * @param {Function} action 
     * @param {*} request 
     * @param {*} response 
     */
    postRequest(action, request, response) {
        // https://blog.csdn.net/u013263917/article/details/78682270
        const self = this;
        let data = '';
        request.on('data', (chunk) => {
            data += chunk;
        });

        request.on('end', () => {
            data = decodeURI(data);
            const params = querystring.parse(data);
            request.params = params;
        })
    }
}

module.exports = new FeDevRouter();