const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');
var httpProxy = require('http-proxy');
var apiProxy = httpProxy.createProxyServer();
var expressStaticGzip = require("express-static-gzip");
const path = require("path");
const app = express();
const port = 5000;
const request = require("request");
const dotenv = require('dotenv');
var proxy = httpProxy.createProxyServer();
dotenv.config();


app.use(
  "/",
  expressStaticGzip(path.join(__dirname, "client", "dist"), {
    enableBrotli: true,
  })
  );

  app.get("/", (req, res) => {
    res.end();
  });

app.get("/overview/:id", (req, res) => {
  const { id } = req.params;
  request(`http://${JSON.parse(process.env.IPS).overviewIP}/overview/${id}`).pipe(res);
});

app.use('/reviews', createProxyMiddleware({
  target: 'http://localhost:3000',
  onProxyReq: function onProxyReq(proxyReq, req) {
    proxyReq.setHeader('Authorization', process.env.API_KEY);
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
}));

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});