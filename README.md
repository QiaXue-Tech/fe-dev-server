# fe-dev-server
前端开发服务器，需要支持代理功能

安装:
```
npm install git+https://github.com/lowequincy/fe-dev-server.git
```

- [x] 能够处理静态资源请求
- [x] 能够指定代理服务器的 `host`
- [x] 能够通过提供路径代理到指定的服务器，关键词可以是多个，比如数组： ['/api', '/services']
- [ ] 能够通过 `yarn` 或者 `npm` 安装到任意前端项目，并且能通过调用函数启动 `httpServer`