module.exports = async(ctx, next) => {
    const token = ctx.cookies.get('token');
    if (token) {
        await next();
    } else {
        ctx.body = '你没有登录';
    }
};