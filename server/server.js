const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const path = require("path");

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const MesaElectoral = require("./services/MesaElectoral");
const ModelMesa = require("./models/MesaElectoral");

const morgan = require("morgan");
const cors = require("cors");
// dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./dotenv/.env" });
// rutas
const routes = require("./routes/routes");
// CONFIG

let conteo = new MesaElectoral();
let conteoEnCurso = false;
io.on("connection", (socket) => {
  conteo.setUmbral();
  console.log("WS: Client connected");
  socket.on("llave privada", (participante) => {
    const jsondata = JSON.parse(participante);
    console.log("participante con id: " + jsondata.id);

    console.log("validando participante");
    let presentes = conteo.verPresentes();
    let estaPresente = false;
    presentes.forEach((participantePresente) => {
      if (participantePresente === jsondata.id) {
        estaPresente = true;
      }
    });

    if (!estaPresente) {
      const result = conteo.validarParticipante(
        jsondata.llave,
        jsondata.id,
        jsondata.contrasena
      );

      if (result.estatus === 0) {
        socket.disconnect();
      } else if (result.estatus === 1 || result.estatus === 4) {
        presentes = conteo.verPresentes();
        ModelMesa.obtenerListaCompleta().then((result) => {
          result.forEach((integranteMesa) => {
            let estatus = 0;
            presentes.forEach((presente) => {
              if (presente === integranteMesa.idMesaElectoral) {
                estatus = 1;
              }
            });
            io.emit("lista mesa", {
              id: integranteMesa.idMesaElectoral,
              estatus: estatus,
            });
          });
        });
        if (result.estatus === 4) {
          conteoEnCurso = true;
          io.emit("comenzando conteo");
          conteo
            .contarVotos()
            .then((result) => {
              io.emit("conteo listo", result);
            })
            .catch((err) => {
              io.emit("error", err);
            });

          conteo = new MesaElectoral();
          conteoEnCurso = false;
        }
      } else {
        io.emit("error", result.error);
        conteo = new MesaElectoral();
      }
    } else {
      presentes = conteo.verPresentes();
      ModelMesa.obtenerListaCompleta().then((result) => {
        result.forEach((integranteMesa) => {
          let estatus = 0;
          presentes.forEach((presente) => {
            if (presente === integranteMesa.idMesaElectoral) {
              estatus = 1;
            }
          });
          socket.emit("lista mesa", {
            id: integranteMesa.idMesaElectoral,
            estatus: estatus,
          });
        });
      });
      if (conteoEnCurso) {
        socket.emit("comenzando conteo");
      }
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
