// server.js
const jsonServer = require('json-server');
const path = require('path');
const uuidv1 = require('uuid/v1');
const moment = require('moment');
const users = require('./users');
const usersProfile = require('./users-profile');
const usersDojos = require('./users-dojos');
const applications = require('./applications');
const events = require('./events');

const server = jsonServer.create();
const router = jsonServer.router(require('./db'));
const locales = require('./locales.js');
const middlewares = jsonServer.defaults();

const pathsToReturnWhenPost = [
  '/api/2.0/dojos',
  '/api/2.0/dojos/find',
  '/api/2.0/dojos/search-bounding-box',
  '/api/2.0/events/search',
  '/api/2.0/events/bulk-apply-applications',
];
const pathsToReturnSingular = [
  '/api/2.0/dojos/find',
];
const nonResourcePostUrls = [
  '/api/2.0/dojos/save-usersdojos',
  '/api/2.0/dojos/request-user-invite',
]
const rewriteRules = {
  '/api/2.0/dojos/find': '/api/2.0/dojos',
  '/api/2.0/events/search': '/api/2.0/events',
  '/api/2.0/dojos/search-bounding-box': '/api/2.0/dojos',
  '/api/2.0/events/bulk-apply-applications': '/api/2.0/bulk-apply-applications'
};

server.use(middlewares);
server.use(require('cookie-parser')());
server.use(require('body-parser').json());
server.use(jsonServer.rewriter(rewriteRules));
server.use((req, res, next) => {
  if (req.originalUrl === '/api/2.0/dojos/search-bounding-box'
    && req.body.query.lat === 53.270668 && req.body.query.lon === -9.056790500000034) {
    res.send([]);
  } else {
    next();
  }
});
server.use((req, res, next) => {
  if (req.method === 'POST' && pathsToReturnWhenPost.indexOf(req.originalUrl) > -1) {
    req.method = 'GET';
    if (req.body.query) {
      req.query = req.body.query;
    }
  }
  next();
});
server.use((req, res, next) => {
  if (pathsToReturnSingular.indexOf(req.originalUrl.split('?')[0]) > -1) {
    const send = res.send;
    res.send = function (string) {
      let body = string instanceof Buffer ? string.toString() : string;
      const json = JSON.parse(body);
      if (json.length && json.length > 0) {
        body = JSON.stringify(json[0]);
      }
      send.call(this, body);
    };
  }
  next();
});
nonResourcePostUrls.forEach((url) => {
  server.post(url, (req, res) => {
    res.send();
  });
});
server.post('/api/2.0/profiles/youth/create', (req, res) => {
  const child = req.body.profile;
  child.id = uuidv1();
  child.userId = uuidv1();
  res.send(child);
});

server.get('/api/2.0/profiles/children-for-user/:parentId', (req, res) => {
  const children = users[req.cookies.loggedIn].children;
  Object.keys(children).forEach((key) => {
    children[key].user = Object.assign({}, children[key]);
    children[key].user.id = children[key].userId;
    delete children[key].user.userId;
  })
  res.send(Object.values(children));
});

server.post('/api/2.0/users/register', (req, res) => {
  users[req.body.user.email] = req.body.user;
  users[req.body.user.email].id = uuidv1();
  users[req.body.user.email].name = `${req.body.user.firstName} ${req.body.user.lastName}`;
  users[req.body.user.email].roles = ['basic-user'];
  users[req.body.user.email].initUserType = JSON.stringify(users[req.body.user.email].initUserType);
  res.send();
});

server.post('/api/2.0/users/login', (req, res) => {
  if (users[req.body.email]) {
    res.cookie('loggedIn', req.body.email, { maxAge: 900000, httpOnly: true });
    res.send();
  } else if (req.body.email === 'failure@example.com') {
    res.send({ ok: false, why: 'invalid-password' });
  } else {
    res.send({ ok: false, why: 'user-not-found' });
  }
});

server.get('/api/2.0/user/events/:id/applications', (req, res) => {
  if (req.cookies.loggedIn) {
    res.send(applications[req.cookies.loggedIn][req.params.id]);
  } else {
    res.send();
  }
});

server.get('/api/2.0/users/instance', (req, res) => {
  if (req.cookies.loggedIn) {
    res.send({
      login: {},
      ok: true,
      user: users[req.cookies.loggedIn],
    });
  } else {
    res.send({
      login: {},
      ok: false,
    });
  }
});

server.post('/api/2.0/profiles/user-profile-data', (req, res) => {
  if (req.cookies.loggedIn) {
    res.send(usersProfile[req.cookies.loggedIn]);
  } else {
    res.send();
  }
});

server.post('/api/2.0/dojos/users', (req, res) => {
  let dojos;
  if (usersDojos[req.body.query.userId]) {
    dojos = usersDojos[req.body.query.userId];
    if (req.body.query.dojoId) {
      if (dojos[req.body.query.dojoId]) {
        res.send(dojos[req.body.query.dojoId]);
      } else {
        res.send([]);
      }
    } else {
      res.send(Object.values(dojos)[0]);
    }
  } else {
    res.send([]);
  }
});

server.get('/api/3.0/dojos/:dojoId/events', (req, res) => {
  const dojoId = req.params.dojoId;
  const { afterDate, beforeDate } = req.query.query;

  const _events = events.filter(e => (e.dojoId === dojoId) &&
    (afterDate && moment(e.dates[0].startTime).unix() > afterDate))
  res.send({ results: _events, count: _events.length });
});

server.use('/api/2.0', router);
server.get('/locale/data', (req, res) => {
  const lang = req.query.lang || 'en_US';
  res.send(locales[lang]);
});

server.get('/locale/languages', (req, res) => {
  res.send([
    { 
      name: 'pt', 
      code: 'pt_PT'
    },
    { 
      name: 'de', 
      code: 'de_DE'
    },
    { 
      name: 'es', 
      code: 'es_ES'
    },
    { 
      name: 'en', 
      code: 'en_US'
    },
  ]);
});


server.listen(3000, () => {
  console.log('JSON Server is running')
});
