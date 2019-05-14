const Koa = require('koa');
const Router = require('koa-router');
const statics = require('koa-static');
const koaBody = require('koa-body');
const cors = require('koa2-cors');
const pageNodeFound = require('./middleware/404');
const log = require('./middleware/log');
const rest = require('./middleware/rest');
const initRender = require('./utils/initRender');
const controller = require('./utils/registerRouter');
const { UPLOADS_PATH, ASSETS_PATH } = require('./constants');

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
        allowHeaders: ['Content-Type', 'Token', 'Accept'],
    }))
    .use(koaBody(
        {
            multipart: true,
            formidable: { 
                keepExtensions: true,
                maxFieldsSize: 10 * 1024 * 1024, // 2M
                uploadDir: UPLOADS_PATH,
            },
        }
    ))
    .use(statics(ASSETS_PATH))
    .use(log)
    .use(rest())
    .use(router.routes())
    .use(router.allowedMethods())
    .use(controller(router)(`${__dirname}/controllers/`))
    .use(pageNodeFound);


app.listen(port, () => {
    console.log(`Server has started at port: ${port}`);
});