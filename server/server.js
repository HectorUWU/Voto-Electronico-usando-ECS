const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");

const morgan = require("morgan");
const cors = require("cors");
// dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./dotenv/.env" });
// rutas
const routes = require("./routes/routes");
// CONFIG

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '50mb'}));

app.use("/api", routes);

app.get('/.well-known/acme-challenge/PGcoYgI9TYeqhGjx2_s6rWx-shDUY1yFCq3vc3UoRNg', function(req, res) {
  res.send('PGcoYgI9TYeqhGjx2_s6rWx-shDUY1yFCq3vc3UoRNg.vNDov1K-Hrr3tw6XVf6MOl0VFwInPlusouTDRQHL6YU')
})

app.use(express.static(path.join(__dirname, "../front", "build")));
app.use(express.static('public'));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "../front/build/index.html"));
  });
}

else {
  app.use(express.static(path.join(__dirname, '/front/public')));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(__dirname, "../front/public/index.html"));
  });
}

app.listen(PORT, function () {
  console.log("listening on port: " + PORT);
});
