module.exports = async function(ctx, next) {
    console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
    await next();
}