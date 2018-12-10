const dayjs = require('dayjs');

// 日期格式化
function dateFormat(timestamp, format='YYYY-MM-DD'){
    return dayjs(timestamp).format(format);
}

module.exports = {
    dateFormat
}