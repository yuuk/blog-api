const fse = require('fs-extra');
const { get } = require('lodash');
const mime = require('mime');
const APIError = require('../utils/apiError');
const checkLogin = require('../middleware/checkLogin');
const { ASSETS_PATH, UPLOADS_PATH } = require('../constants');

// 获取附件
async function getAttachments(domain) {
    const files = await fse.readdir(UPLOADS_PATH);
    return files.map((file, index) => {
        const path = UPLOADS_PATH + file;
        const url = path.replace(ASSETS_PATH, `${domain}/`);
        let type = mime.getType(path);  
        if (type) {
            type = type.split('/')[0].toUpperCase();
        }
        return {
            id: index,
            type,
            url,
        };
    });
}


module.exports = [
    // 上传文件
    {
        method: 'POST',
        path: '/api/upload',
        use: [ checkLogin ],
        handler: async(ctx) => {
            const domain = ctx.request.origin;
            console.warn(ctx.request.origin);
            const file = get(ctx.request, 'files.attachment');
            if (file) {
                file.path = file.path.replace(ASSETS_PATH, `${domain}/`);
                await ctx.rest(file);
                return;
            }
            throw new APIError('upload:no_attachment', '上传错误, 请检查参数是否完整!');
        }
    },
    // 读取文件
    {
        method: 'GET',
        path: '/api/attachments',
        use: [ checkLogin ],
        handler: async(ctx) => {
            try{
                const result = await getAttachments(ctx.request.origin);
                await ctx.rest(result);
            } catch(e) {
                throw new APIError('attachment:attachment_error', '获取附件错误!');
            }
        }
    },
   
];