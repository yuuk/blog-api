const Sequelize = require('sequelize');

const TYPES = [
    'STRING',
    'INTEGER',
    'BIGINT',
    'TEXT',
    'DOUBLE',
    'DATEONLY',
    'BOOLEAN',
    'DATE',
];

const sequelize = new Sequelize('blog', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    freezeTableName: true,
    operatorsAliases: false,
});

sequelize
.authenticate()
.then(() => {
    console.log('数据库连接成功！');
})
.catch(err => {
    console.error('数据库连接失败！', err);
});

/******** exports ***********/

for (let type of TYPES) {
    exports[type] = Sequelize[type];
}

exports.defineModel = function(name, attributes={}, options={}) {
    return sequelize.define(name, attributes, Object.assign({}, {
        tableName: name,
        timestamps: false,
    }, options));
};

exports.sync = function() {
    if (process.env.NODE_ENV !== 'production') {
        sequelize.sync({ force: true });
    } else {
        throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
    }
};