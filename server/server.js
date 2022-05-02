const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const MesaElectoral = require("./services/MesaElectoral");

const morgan = require("morgan");
const cors = require("cors");
// dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./dotenv/.env" });
// rutas
const routes = require("./routes/routes");
// CONFIG

const conteo = new MesaElectoral();
io.on("connection", (socket) => {
  console.log("WS: Client connected");
  socket.on("participante", (participante) => {
    console.log("Llave recibida para participante con id: " + participante.id);
    let presentes = conteo.verPresentes();
    let estaPresente = false;

    presentes.forEach((participantePresente) => {
      if (participantePresente === participante.id) {
        estaPresente = true;
      }
    });

    if(!estaPresente){
      conteo.validarParticipante(participante.llave, participante.id, participante.contrasena).then((result => {
        if(result.estatus === 0){
          socket.disconnect();
        }
        if(result.estatus === 1 || result.estatus === 2){
          presentes = conteo.verPresentes();
          io.emit('presentes', presentes);
        }

        if(result.estatus === 2){
          io.emit('resultado', result.mensaje);
        }
        
      }))
    }

  });
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));

app.use("/api", routes);

app.use(express.static(path.join(__dirname, "../front", "build")));
app.use(express.static("public"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../front/build/index.html"));
  });
} else {
  app.use(express.static(path.join(__dirname, "/front/public")));
  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../front/public/index.html"));
  });
}

server.listen(PORT, () => {
  console.log("listening on port: " + PORT);
});
