module.exports = (prefix='/api/') => {
    return async(ctx, next) => {
        if (ctx.request.path.startsWith(prefix)) {
            ctx.rest = (data) => {
                ctx.response.type = 'application/json';
                ctx.response.body = data;
            };
            try {
                await next();
            } catch (e) {
                // 返回错误:
                ctx.response.status = 400;
                ctx.response.type = 'application/json';
                ctx.response.body = {
                    code: e.code || 'internal:unknown_error',
                    message: e.message || '',
                };
            }
        } else {
            await next();
        }
    };
};