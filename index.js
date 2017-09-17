/* eslint-disable */

'use strict';

var fs = require('fs');
var _ = require('lodash');
var Handlebars = require('handlebars');

var openGraphTemplateString = fs.readFileSync(__dirname + '/dist/opengraph.hbs', { encoding: 'UTF-8' });
var openGraphTemplate = Handlebars.compile(openGraphTemplateString);

exports.register = function (server, options, next) {

  if (process.env.NODE_ENV !== 'production') {
    server.route({
      method: 'GET',
      path: '/v2/{param*}',
      handler: {
        file: {
          path: __dirname + '/dist/index.html'
        }
      }
    });
  }

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
    path: '/dojos/{id}',
    handler: {
      file: {
        path: __dirname + '/dist/index.html'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/dojos/{id}/{alpha2*}',
    handler: function (request, reply) {
      reply(openGraphTemplate({
        openGraphProperties: request.locals.context.preload
      }));
    },
    config: {
      plugins: {
        senecaPreloader: {
          handler: 'seneca-dojo-preloader'
        }
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/dashboard/tickets',
    handler :{
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
