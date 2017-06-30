/* eslint-disable */

'use strict';

var _ = require('lodash');

exports.register = function (server, options, next) {

  server.route({
    method: 'GET',
    path: '/v2/{param*}',
    handler: {
      file: {
        path: __dirname + '/dist/index.html'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/v2/static/{param*}',
    handler: {
      directory: {
        path: __dirname + '/dist/static'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/dojos/{country}/{path*}',
    handler: {
      file: {
        path: __dirname + '/dist/index.html'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: {
      file: {
        path: __dirname + '/dist/index.html'
      }
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
