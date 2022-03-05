const express = require("express");
var expressStaticGzip = require("express-static-gzip");
const path = require("path");
const app = express();
const port = 5000;
const request = require("request");

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

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
