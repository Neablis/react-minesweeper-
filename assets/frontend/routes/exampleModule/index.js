var MiddlewareProcessor = require('../../middleware-processor');
//var Middleware = require('../middleware');

MiddlewareProcessor.register('example', []);

module.exports = {
    path: 'example',
    getComponent(location, cb) {
        require.ensure([], (require) => {
            cb(null, require('../../components/exampleModule'));
        });
    }
};
