import http from 'http';
import https from 'https';
import url from 'url';
import path from 'path';
import fs from 'fs';
import express from 'express';
import vite from 'vite';
import dotenv from 'dotenv';

// Variables in .env and .env.defaults will be added to process.env
dotenv.config({ path: '.env' });

Error.stackTraceLimit = 300;
const cwd = process.cwd();

const isProduction = process.argv[2] === '-p';

const _isMediaType = p => /\.(?:png|jpe?g|gif|svg|glb|mp3|wav|webm|mp4|mov)$/.test(p);

const _tryReadFile = p => {
  try {
    return fs.readFileSync(p);
  } catch (err) {
    // console.warn(err);
    return null;
  }
};
const certs = {
  key: _tryReadFile('./certs/privkey.pem') || _tryReadFile('./certs-local/privkey.pem'),
  cert: _tryReadFile('./certs/cert.pem') || _tryReadFile('./certs-local/cert.pem')
};

(async () => {
  const app = express();
  app.use('*', async (req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    if (/^\/(?:projects|whats-new|new|login|logout|kits)/.test(req.originalUrl) && !req.originalUrl.endsWith('/')) {
      req.originalUrl += req.originalUrl.endsWith('/') ? '' : '/';
      return res.redirect(req.originalUrl);
    }
    const o = url.parse(req.originalUrl, true);

    if (/^\/(?:@proxy|public)\//.test(o.pathname) && o.query['import'] === undefined) {
      const u = o.pathname
        .replace(/^\/@proxy\//, '')
        .replace(/^\/public/, '')
        .replace(/^(https?:\/(?!\/))/, '$1/');
      if (_isMediaType(o.pathname)) {
        const proxyReq = /https/.test(u) ? https.request(u) : http.request(u);
        proxyReq.on('response', proxyRes => {
          for (const header in proxyRes.headers) {
            res.setHeader(header, proxyRes.headers[header]);
          }
          res.statusCode = proxyRes.statusCode;
          proxyRes.pipe(res);
        });
        proxyReq.on('error', err => {
          console.error(err);
          res.statusCode = 500;
          res.end();
        });
        proxyReq.end();
      } else {
        req.originalUrl = u;
        next();
      }
    } else if (o.query['noimport'] !== undefined) {
      const p = path.join(cwd, path.resolve(o.pathname));
      const rs = fs.createReadStream(p);
      rs.on('error', err => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('not found');
        } else {
          console.error(err);
          res.statusCode = 500;
          res.end(err.stack);
        }
      });
      rs.pipe(res);
      // _proxyUrl(req, res, req.originalUrl);
    } /* else if (/^\/login/.test(o.pathname)) {
      req.originalUrl = req.originalUrl.replace(/^\/(login)/, "/");
      return res.redirect(req.originalUrl);
    }*/ else {
      next();
    }
  });

  const SERVER_ADDR = process.env.VITE_HOST_IP || '0.0.0.0';
  const isHttps = !process.env.HTTP_ONLY && !!certs.key && !!certs.cert;
  const port = parseInt(process.env.VITE_HOST_PORT, 10) || (isProduction ? 443 : 3000);

  const _makeHttpServer = () => (isHttps ? https.createServer(certs, app) : http.createServer(app));
  const httpServer = _makeHttpServer();
  const viteServer = await vite.createServer({
    server: {
      middlewareMode: 'html',
      force: true,
      hmr: {
        server: httpServer,
        port,
        overlay: false
      }
    }
  });
  app.use(viteServer.middlewares);

  await new Promise((accept, reject) => {
    httpServer.listen(port, SERVER_ADDR, () => {
      accept();
    });
    httpServer.on('error', reject);
  });
  console.log(`  > Local: http${isHttps ? 's' : ''}://${SERVER_ADDR}:${port}/`);
})();
