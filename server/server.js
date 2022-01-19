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
app.use(express.json());
app.use("/api", routes);
app.use(express.static(path.join(__dirname, "../front", "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front", "public", "index.html"));
});

app.listen(PORT, function () {
  console.log("listening on port: " + PORT);
});
