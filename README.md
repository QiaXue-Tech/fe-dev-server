# fe-dev-server

前端开发服务器，支持代理功能

安装:

``` bash
npm install git+https://github.com/lowequincy/fe-dev-server.git
```

或者:

``` bash
npm install qx-fe-dev-server
```

- [x] 能够处理静态资源请求
- [x] 能够指定代理服务器的 `host`
- [x] 能够通过提供路径代理到指定的服务器，关键词可以是多个，比如数组： ['/api', '/services']
- [x] 能够通过 `yarn` 或者 `npm` 安装到任意前端项目，并且能通过调用函数启动 `httpServer`

## 设置代理功能

默认情况下不进行代理，如需要代理请求需要配置，代码如下：

``` node
const FeServer = require('qx-fe-dev-server');
const app = new FeServer();

app.router.proxyTable = {
    'api': {    // 'api' 是前端 ajax 请求中 url 的关键字，如 `/api/xxxxx/xxxx`,包含指定关键字则对请求进行转发
        host: 'localhost',
        port: 3000
    }
};

app.runServer();
```

## 设置起始页

默认情况下起始页为项目根目录下的 `index.html` 页面，如需指定其他起始页可进行如下配置：

``` node
const FeServer = require('qx-fe-dev-server');
const app = new FeServer();

app.indexPage = '/index1.html';     // 设置起始页

app.runServer();
```

## 打开指定html页面

``` node
const FeServer = require('qx-fe-dev-server');
const app = new FeServer();

app.renderView('/index', '/views/index.html');      // 将打开根目录下views目录中的 index.html 页面

app.runServer();
```