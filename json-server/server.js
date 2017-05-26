// server.js
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

const pathsToReturnWhenPost = [
  '/api/2.0/dojos',
  '/api/2.0/dojos/find',
  '/api/2.0/dojos/search-bounding-box',
];
const pathsToReturnSingular = [
  '/api/2.0/dojos/find'
];
var rewriteRules = {
  '/api/2.0/dojos/find': '/api/2.0/dojos',
  '/api/2.0/dojos/search-bounding-box': '/api/2.0/dojos',
};

server.use(middlewares);
server.use(require('body-parser').json());
server.use(jsonServer.rewriter(rewriteRules));
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
  const send = res.send;
  res.send = function (string) {
    let body = string instanceof Buffer ? string.toString() : string;
    const json = JSON.parse(body);
    if (pathsToReturnSingular.indexOf(req.originalUrl.split('?')[0]) > -1 && json.length && json.length > 0) {
      body = JSON.stringify(json[0]);
    }
    send.call(this, body);
  };
  next();
});
server.use('/api/2.0', router);

server.listen(3000, () => {
  console.log('JSON Server is running')
})
