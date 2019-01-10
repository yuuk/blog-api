module.exports = async function(ctx, next) {
    ctx.set('content-type', 'application/json; charset=utf-8');
    ctx.set('Access-Control-Allow-Methods', 'OPTIONS,HEAD,GET,PUT,POST,DELETE,PATCH');
    ctx.set('Access-Control-Allow-Origin', '*');
    await next();
};