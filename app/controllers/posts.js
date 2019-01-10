const { isEmpty } = require('lodash');
const { posts } = require('../models/');
const APIError = require('../utils/apiError');



function checkPost(body) {
    const { title, content } = body;
    // 检查标题
    if (isEmpty(title)) {
        throw new APIError('posts:title_empty', '标题不能为空！');
    }
    // 检查文章内容
    if (isEmpty(content) || content === '<p></p>') {
        throw new APIError('posts:content_empty', '正文不能为空！');
    }
}

module.exports = [
    // 获取文章列表
    {
        method: 'GET',
        path: '/api/posts',
        handler: async(ctx) => {
            const { page=1, pageSize=10, status='publish' } = ctx.query;
            const data = await posts.findAll({
                limit: pageSize,
                offset: page * pageSize - pageSize,
                where: { publish_status: status },
                order: [
                    ['publish_time', 'DESC']
                ]
            });
            await ctx.rest({
                data,
                page,
                total: 200,
            });
        }
    },
    // 获取单条文章
    {
        method: 'GET',
        path: '/api/posts/:id',
        handler: async(ctx) => {
            const { id } = ctx.params;
            const data = await posts.findOne({
                where: {id: id}
            });
            if (!data) {
                throw new APIError('posts:record_not_found', '文章ID非法！');
            }
            await ctx.rest(data);
        }
    },
    // 新增文章
    {
        method: 'POST',
        path: '/api/posts',
        handler: async(ctx) => {
            const { body } = ctx.request;
            await checkPost(body);
            await posts.create(body);
            await ctx.rest({});
        }
    },
    // 更新文章
    {
        method: 'PUT',
        path: '/api/posts/:id/update',
        handler: async(ctx) => {
            const { id } = ctx.params;
            const { body } = ctx.request;
            await checkPost(body);
            await posts.update(body, {
                where:{id: id}
            });
            await ctx.rest({});
        }
    },
    // 移入回收站 / 恢复
    {
        method: 'PUT',
        path: '/api/posts/:ids/:status',
        handler: async(ctx) => {
            const PUBLISH_STATUS = ['publish', 'trash'];
            const { ids, status } = ctx.params;
            const idArray = ids.split(',');
            if (!PUBLISH_STATUS.includes(status)) {
                throw new APIError('posts:status_not_allowed', '参数非法！');
            }
            await posts.update({ publish_status: status }, {
                where:{id: idArray}
            });
            await ctx.rest({});
        }
    },
    // 删除文章（物理删除）
    {
        method: 'DELETE',
        path: '/api/posts/:ids',
        handler: async(ctx) => {
            const { ids } = ctx.params;
            const idArray = ids.split(',');
            await posts.destroy({
                where:{id: idArray}
            });
            await ctx.rest({});
        }
    }
];