const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");
// CONFIG
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../front", "build")));
// SERVER
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../front", "build", "index.html"));
});

app.listen(PORT, function () {
  console.log("listening on port: " + PORT);
});