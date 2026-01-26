// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy target is always http://localhost:9260 (the pgr-analytics API server)
  // This proxy is used in development to avoid CORS issues
  const proxyTarget = 'http://localhost:9260';
  
  app.use(
    '/api',
    createProxyMiddleware({
      target: proxyTarget,
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying request:', req.url, '->', proxyReq.path);
        console.log('Proxy target:', proxyTarget);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        console.error('Proxy target was:', proxyTarget);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end(`Proxy error: ${err.message}`);
      }
    })
  );
};