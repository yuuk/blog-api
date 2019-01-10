const Koa = require('koa');
const Router = require('koa-router');
const statics = require('koa-static');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const pageNodeFound = require('./middleware/404');
const log = require('./middleware/log');
const rest = require('./middleware/rest');
const initRender = require('./utils/initRender');
const controller = require('./utils/registerRouter');

const app = new Koa();
const router = new Router();
const port = process.env.PORT || 8888;

initRender(app);

app
    .use(cors({
        origin: () => '*',
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    }))
    .use(bodyParser())
    .use(statics(`${__dirname}/views/`))
    .use(log)
    .use(rest())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(controller(router)(`${__dirname}/controllers/`))
    .use(pageNodeFound);


app.listen(port, () => {
    console.log(`Server has started at port: ${port}`);
});