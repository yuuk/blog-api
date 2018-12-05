const Koa = require('koa');
const app = new Koa();
const port = 8888;

app.use(async ctx => {
    ctx.body = 'Hello docker';
});

app.listen(port, () => {
    console.log('服务器已启动');
});