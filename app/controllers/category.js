const { isEmpty } = require('lodash');
const { category, posts } = require('../models/');
const APIError = require('../utils/apiError');
const checkLogin = require('../middleware/checkLogin');
 
module.exports = [
    // 获取分类列表
    {
        method: 'GET',
        path: '/api/categories',
        use: [ checkLogin ],
        handler: async(ctx) => {
            const data = await category.findAll({});
            await ctx.rest(data);
        }
    },
    // 新增分类
    {
        method: 'POST',
        path: '/api/category',
        use: [ checkLogin ],
        handler: async(ctx) => {
            const { body } = ctx.request;
            await category.create(body);
            await ctx.rest({});
        }
    },
    // 更新分类
    {
        method: 'PUT',
        path: '/api/category/:id',
        use: [ checkLogin ],
        handler: async(ctx) => {
            const { id } = ctx.params;
            const { body } = ctx.request;
            // 设置 parent_id 默认值
            if (!body.parent_id) {
                body.parent_id = -1;
            }
            await category.update(body, {
                where:{id: id}
            });
            await ctx.rest({});
        }
    },
    // 删除分类（物理删除）
    {
        method: 'DELETE',
        path: '/api/categories/:id',
        use: [ checkLogin ],
        handler: async(ctx) => {
            const { id } = ctx.params;
            const children = await category.findAll({
                where: { parent_id: id }
            });
            const foundPosts = await posts.findAll({
                where: { category_id: id }
            });
            // 判断是否父栏目
            if (!isEmpty(children)) {
                throw new APIError('category:not_allowed_to_delete', '父栏目不允许删除!');
            }
            // 判断分类下是否有文章
            if (!isEmpty(foundPosts)) {
                throw new APIError('category:not_allowed_to_delete', '该栏目下有文章,不允许删除!');
            }
            await category.destroy({
                where:{id: id}
            });
            await ctx.rest(foundPosts);
        }
    }
];