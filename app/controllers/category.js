const { category } = require('../models/');
const APIError = require('../utils/apiError');

module.exports = [
    // 获取分类列表
    {
        method: 'GET',
        path: '/api/categories',
        handler: async(ctx) => {
            const data = await category.findAll({});
            await ctx.rest(data);
        }
    },
    // 新增分类
    {
        method: 'POST',
        path: '/api/category',
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
        handler: async(ctx) => {
            const { id } = ctx.params;
            const children = await category.findAll({
                where: { parent_id: id }
            });
            // 判断是否父栏目
            if (children.length > 0) {
                throw new APIError('category:not_allowed_to_delete', '父栏目不允许删除!');
            }
            await category.destroy({
                where:{id: id}
            });
            await ctx.rest({});
        }
    }
];