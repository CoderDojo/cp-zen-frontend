/* eslint-disable */

'use strict';

var fs = require('fs');
var _ = require('lodash');
var Handlebars = require('handlebars');

var openGraphTemplateString = fs.readFileSync(__dirname + '/dist/opengraph.hbs', { encoding: 'UTF-8' });
var openGraphTemplate = Handlebars.compile(openGraphTemplateString);

exports.register = function (server, options, next) {

  server.path(`${__dirname}/dist/`);

  server.route({
    method: 'GET',
    path: '/static/{param*}',
    handler: {
      directory: {
        path: 'static'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/dojos/{id}',
    handler: {
      file: {
        path: 'index.html'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/dojos/{id}/{alpha2*}',
    handler: function (request, reply) {
      reply(openGraphTemplate({
        openGraphProperties: request.app.context.preload
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
        path: 'index.html'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/dashboard/dojos/events/user-events',
    handler :{
      file: {
        path: 'index.html'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/login',
    handler: {
      file: {
        path: 'index.html'
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/home',
    handler: {
      file: {
        path: 'index.html'
      }
    }
  });  

  server.route({
    method: 'GET',
    path: '/events/{eventId}',
    handler: function (request, reply) {
      reply(openGraphTemplate({
        openGraphProperties: request.app.context.preload
      }));
    },
    config: {
      plugins: {
        senecaPreloader: {
          handler: 'seneca-event-preloader'
        }
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/events/{eventId}/sessions',
    handler: function (request, reply) {
      reply(openGraphTemplate({
        openGraphProperties: request.app.context.preload
      }));
    },
    config: {
      plugins: {
        senecaPreloader: {
          handler: 'seneca-event-preloader'
        }
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/events/{eventId}/confirmation',
    handler: function (request, reply) {
      reply(openGraphTemplate({
        openGraphProperties: request.app.context.preload
      }));
    },
    config: {
      plugins: {
        senecaPreloader: {
          handler: 'seneca-event-preloader'
        }
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: {
      file: {
        path: 'index.html'
      }
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
