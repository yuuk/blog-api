const { isEmpty, isArray, pullAllBy } = require('lodash');
const { posts, tags } = require('../models/');
const APIError = require('../utils/apiError');
const { query } = require('../utils/db');
const checkLogin = require('../middleware/checkLogin');

// 校验文章
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

// 根据 ID 查询标签
async function queryTagsById(ids) {
    const tagIds = isArray(ids) ? ids : ids.split(',');
    const result = await tags.findAll({
        where: { id: tagIds },
        attributes: ['title', 'id'],
    });
    return result;
}

// 文章标签的相关处理
async function handlePostTags(body) {
    let postTagsIds = null;
    if (body.tags) {
        const tagsArray = body.tags.split(',');
        const tagsArrayWithTitle = tagsArray.map(item => ({ title: item }));
        // 查找tag是否已存在
        const foundTags = await tags.findAll({
            attributes: ['title', 'id'],
            where: { title: tagsArray }
        });
        // 过滤交集
        const uniqueTags = pullAllBy(tagsArrayWithTitle, foundTags, 'title');
        // tag入库
        const insertedTags = await tags.bulkCreate(uniqueTags); 
        // 当前文章tags
        const postTags = foundTags.concat(insertedTags);
        // 文章tag id入库
        postTagsIds = postTags.map(item => item.id).join(',');
    }
    return postTagsIds;
}

module.exports = [
    // 获取文章列表
    {
        method: 'GET',
        path: '/api/posts',
        use: [ checkLogin ],
        handler: async(ctx) => {
            let { page=1, page_size=10, status='publish', keyword='' } = ctx.query;
            page = Number(page);
            page_size = Number(page_size);
            if (isNaN(page) || isNaN(page_size)) {
                throw new APIError('posts:illegal_param', '参数非法！');
            }
            const offset = page * page_size - page_size;
            const total = await posts.count({
                where: {
                    publish_status: status
                }
            });
            const data = await query(`
                SELECT
                p.id,
                p.title,
                p.view_count,
                p.publish_status,
                p.publish_time,
                c.title AS category,
                GROUP_CONCAT(t.title) AS tag_names
                FROM posts AS p
                LEFT JOIN tags AS t
                ON FIND_IN_SET(t.id, p.tag_ids)
                LEFT JOIN category AS c
                ON c.id = p.category_id
                WHERE p.publish_status = '${status}' AND p.title LIKE '%${keyword}%'
                GROUP BY p.id
                ORDER BY publish_time DESC
                LIMIT ${page_size}
                OFFSET ${offset}
            `);
            
            await ctx.rest({
                page,
                page_size,
                total,
                data
            });
        }
    },
    // 获取单条文章
    {
        method: 'GET',
        path: '/api/posts/:id',
        use: [ checkLogin ],
        handler: async(ctx) => {
            const { id } = ctx.params;
            const data = await posts.findByPk(id);
            if (!data) {
                throw new APIError('posts:record_not_found', '文章ID非法！');
            }
            if (data.tag_ids) {
                data.tag_ids = await queryTagsById(data.tag_ids);
            }
            await ctx.rest(data);
        }
    },
    // 新增文章
    {
        method: 'POST',
        path: '/api/posts',
        use: [ checkLogin ],
        handler: async(ctx) => {
            const { body } = ctx.request;
            body.tag_ids = await handlePostTags(body);
            await checkPost(body);
            await posts.create(body);
            await ctx.rest({});
        }
    },
    // 更新文章
    {
        method: 'PUT',
        path: '/api/posts/:id/update',
        use: [ checkLogin ],
        handler: async(ctx) => {
            const { id } = ctx.params;
            const { body } = ctx.request;
            body.tag_ids = await handlePostTags(body);
            await checkPost(body);
            await posts.update(body, {
                where: { id }
            });
            await ctx.rest({});
        }
    },
    // 移入回收站 / 恢复
    {
        method: 'PUT',
        path: '/api/posts/:ids/:status',
        use: [ checkLogin ],
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
        use: [ checkLogin ],
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