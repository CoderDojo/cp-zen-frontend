'use strict';

var _ = require('lodash');

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

    server.ext('onPreResponse', function (request, reply) {
        var status = _.has(request, 'response.output.statusCode') ? request.response.output.statusCode : 200;
        if (status === 404 && request.path.indexOf('/v2/') === 0) {
            return reply.file(__dirname + '/dist/index.html');
        }
        return reply.continue();
    });

    next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
