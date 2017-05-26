// server.js
const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

const apiBase = '/api/2.0';
const pathsToReturnWhenPost = [
  '/dojos',
  '/dojos/search-bounding-box',
].map(reqPath => apiBase + reqPath);

server.use((req, res, next) => {
  if (req.method === 'POST' && pathsToReturnWhenPost.indexOf(req.path) > -1) {
    req.method = 'GET';
  }
  next();
});
server.use(jsonServer.rewriter({
  '/api/2.0/dojos/search-bounding-box': '/api/2.0/dojos',
}));

server.use(middlewares);
server.use(apiBase, router);

server.listen(3000, () => {
  console.log('JSON Server is running');
});
