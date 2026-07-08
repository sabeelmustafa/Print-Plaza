const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const port = process.env.PORT || 3000;
const distDir = path.join(__dirname, 'dist');
const indexFile = path.join(distDir, 'index.html');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function sendFile(res, filePath) {
  fs.readFile(filePath, function (error, data) {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server error');
      return;
    }

    res.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    });
    res.end(data);
  });
}

http.createServer(function (req, res) {
  const parsedUrl = url.parse(req.url);
  const pathname = decodeURIComponent(parsedUrl.pathname || '/');
  const requestedPath = path.normalize(path.join(distDir, pathname));

  if (requestedPath.indexOf(distDir) !== 0) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(requestedPath, function (error, stats) {
    if (!error && stats.isFile()) {
      sendFile(res, requestedPath);
      return;
    }

    sendFile(res, indexFile);
  });
}).listen(port, function () {
  console.log('Print Plaza server running on port ' + port);
});
