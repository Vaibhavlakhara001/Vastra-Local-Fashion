const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const PUBLIC_DIR = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function handleRequest(req, res) {
  let parsedUrl = (req.url || '/').split('?')[0];
  if (parsedUrl === '/' || parsedUrl === '') {
    parsedUrl = '/index.html';
  }

  // Sanitize path to prevent directory traversal
  const safeSuffix = path.normalize(parsedUrl).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(PUBLIC_DIR, safeSuffix);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    });
  });
}

function createServer() {
  return http.createServer(handleRequest);
}

function startServer(port) {
  const s = createServer();
  s.once('error', (err) => {
    if (err.code === 'EADDRINUSE' || err.code === 'EACCES') {
      console.log(`Port ${port} unavailable (${err.code}), trying port ${port + 1}...`);
      if (port < 3010) {
        startServer(port + 1);
      } else {
        console.error('Could not bind to ports 3000-3010:', err.message);
      }
    } else {
      console.error('Server error:', err);
    }
  });
  s.listen(port, () => {
    console.log(`\n======================================================`);
    console.log(`  VASTRA – Local Fashion Marketplace`);
    console.log(`  "Har Local Dukaan, Ab Online."`);
    console.log(`======================================================`);
    console.log(`  🚀 Live Server running at: http://localhost:${port}`);
    console.log(`  🛍️ Open your browser and explore local fashion stores!\n`);
  });
}

// Only start listening if run directly from CLI (e.g. node server.js / npm start)
if (require.main === module) {
  startServer(DEFAULT_PORT);
}

// Export request handler for Serverless function environments (e.g. Vercel)
module.exports = handleRequest;
