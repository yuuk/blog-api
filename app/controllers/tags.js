const { tags } = require('../models/');
const { query } = require('../utils/db');
const APIError = require('../utils/apiError');
const checkLogin = require('../middleware/checkLogin');

module.exports = [
    // 获取列表
    {
        method: 'GET',
        path: '/api/tags',
        use: [ checkLogin ],
        handler: async(ctx) => {
            let { page=1, page_size=10, keyword='' } = ctx.query;
            page = Number(page);
            page_size = Number(page_size);
            if (isNaN(page) || isNaN(page_size)) {
                throw new APIError('posts:illegal_param', '参数非法！');
            }
            const offset = page * page_size - page_size;

            console.warn(offset);

            const total = await tags.count();
            const data = await query(`
                SELECT
                    result.id,
                    result.title,
                    result.alias,
                    result.create_time,
                    sum( result.post_num ) AS count 
                FROM
                    (
                SELECT
                    tags.*,
                IF 
                    ( ISNULL( posts.id ), 0, 1  ) AS post_num 
                FROM
                    tags
                    LEFT JOIN posts ON find_in_set( tags.id, posts.tag_ids ) 
                    ) AS result 
                WHERE
                    result.title LIKE '%${keyword}%' 
                GROUP BY
                    result.id
                ORDER BY 
                    result.create_time DESC
                LIMIT ${page_size}
                OFFSET ${offset}
            `);
            await ctx.rest({
                page,
                page_size,
                total,
                data,
            });
        }
    },
    // 新增
    {
        method: 'POST',
        path: '/api/tag',
        use: [ checkLogin ],
        handler: async(ctx) => {
            const { body } = ctx.request;
            await tags.create(body);
            await ctx.rest({});
        }
    },
    // 更新
    {
        method: 'PUT',
        path: '/api/tag/:id',
        use: [ checkLogin ],
        handler: async(ctx) => {
            const { id } = ctx.params;
            const { body } = ctx.request;
            // 设置 parent_id 默认值
            if (!body.parent_id) {
                body.parent_id = -1;
            }
            await tags.update(body, {
                where:{id: id}
            });
            await ctx.rest({});
        }
    },
    // 删除（物理删除）
    {
        method: 'DELETE',
        path: '/api/tags/:id',
        use: [ checkLogin ],
        handler: async(ctx) => {
            const { id } = ctx.params;
            const idArray = id.split(',');
            await tags.destroy({
                where: { id: idArray }
            });
            await ctx.rest({});
        }
    },
];