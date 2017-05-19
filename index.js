'use strict';

exports.register = function (server, options, next) {

    server.route({
        method: 'GET',
        path: '/v2/{param*}',
        handler: {
            directory: {
                path: __dirname + '/dist',
                index: true
            }
        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};