const fs = require('fs');
const Handlebars = require('handlebars');
const pkg = require('./package.json');

const openGraphTemplate = Handlebars.compile(
  fs.readFileSync(`${__dirname}/dist/opengraph.hbs`, { encoding: 'UTF-8' }),
);

const handler = { file: { path: 'index.html' } };

exports.register = (server, options, next) => {
  server.path(`${__dirname}/dist/`);
  if (process.env.NODE_ENV !== 'production') {
    server.route({
      method: 'GET',
      path: '/v2/{param*}',
      handler,
    });
  }

  server.route({
    method: 'GET',
    path: '/v2/static/{param*}',
    handler: {
      directory: {
        path: 'static',
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/dojos/{id}',
    handler,
  });

  server.route({
    method: 'GET',
    path: '/dojos/{id}/{alpha2*}',
    handler(request, reply) {
      reply(
        openGraphTemplate({
          openGraphProperties: request.app.context.preload,
        }),
      );
    },
    config: {
      plugins: {
        senecaPreloader: {
          handler: 'seneca-dojo-preloader',
        },
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/dashboard/tickets',
    handler,
  });

  server.route({
    method: 'GET',
    path: '/dashboard/dojos/events/user-events',
    handler,
  });

  server.route({
    method: 'GET',
    path: '/',
    handler,
  });

  next();
};

exports.register.attributes = {
  pkg,
};
