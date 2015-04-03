var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');

var server = connect()
  .use(serveStatic('.'))
  .use(function serveNotFoundIndex(req, res, next) {
    if (req.method !== 'GET' || !req.headers.accept.match('text/html')) {
      return next();
    }
    send(req, '/index.html')
      .pipe(res);
  });

var port = 8080;
http.createServer(server)
  .listen(port)
  .once('error', function (err) {
    if (err.code === 'EADDRINUSE') {
      console.log('Port in use: %s', port);
    } else {
      console.error(err);
    }
  })
  .on('listening', function () {
    console.log('\x1B[32mStarted web server on http://localhost:' + port + ' ✓\x1B[0m');
  });