const express = require('express');
const path = require('path');

const port = 8080;
const app = express();

// serve static assets normally
app.use(express.static(path.resolve(__dirname, 'dist')));

// block known api route causing looping redirect
app.get('/rpi/*', (request, response) => {
  response.send('fin.');
});

// handle every other route with index.html
app.get('*', (request, response) => {
  response.sendFile(path.resolve(__dirname, 'dist/index.html'));
});

app.listen(port);
