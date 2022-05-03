"use strict";

const express = require("express");
const { Server } = require("ws");

const PORT = 30000;
const INDEX = "/index.html";
let server;

class WSSService {
  abrirSocket() {
    server = express()
      .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
      .listen(PORT, () => console.log(`Listening on ${PORT}`));

    const wss = new Server({ server });

    wss.on("connection", (ws) => {
      console.log("Client connected");
      ws.on("close", () => console.log("Client disconnected"));
    });
  }

  comprobarSocket() {
    if (server != null) {
      return false;
    }
    return true;
  }
}

module.exports = WSSService;