const fs = require('fs');
const path = require('path');
const { isFunction } = require('lodash');

function registerRoute(router, mapping) {
    const { method='get', path='/', use=[], handler=()=>{} } = mapping;
    const isValidMiddleware = use.every(isFunction);
    // middleware 都是 function
    if (isValidMiddleware) {
        router[method.toLowerCase()](path, ...use, handler);
    } else {
        throw new Error('middlewares is not valid!');
    }
}

function handleFiles(router, dir) {
    if (!dir) throw new Error('Controllers path not found');
    fs.readdirSync(dir)
        .filter(filename => filename.endsWith('.js'))
        .forEach(filename => {
            const mappings = require(path.join(dir, filename));
            mappings.forEach(mapping => {
                registerRoute(router, mapping);
            });
            
        });
}

module.exports = function(router) {
    return function(dir) {
        handleFiles(router, dir);
        return router.routes();
    };
};