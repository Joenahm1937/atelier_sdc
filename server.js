const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
var httpProxy = require("http-proxy");
var apiProxy = httpProxy.createProxyServer();
var expressStaticGzip = require("express-static-gzip");
const path = require("path");
const app = express();
const port = 5000;
const request = require("request");
const dotenv = require("dotenv");
const cors = require("cors");
var proxy = httpProxy.createProxyServer();
dotenv.config();
const { overviewIP, reviewsIP, qaIP } = process.env.IPS
  ? `http://${JSON.parse(process.env.IPS)}`
  : "http://localhost:3000";

app.use(cors());

app.use(
  "/",
  expressStaticGzip(path.join(__dirname, "client", "dist"), {
    enableBrotli: true,
  })
);

app.get("/", (req, res) => {
  res.end();
});

app.use(
  "/products",
  createProxyMiddleware({ target: overviewIP, changeOrigin: true })
);

app.use(
  "/reviews",
  createProxyMiddleware({ target: reviewsIP, changeOrigin: true })
);

app.use("/qa", createProxyMiddleware({ target: qaIP, changeOrigin: true }));

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
