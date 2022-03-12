const WebSocket = require("ws");
const http = require("http");
const server = http.createServer();
const wss = new WebSocket.Server({ server });
const MesaElectoral = require("./MesaElectoral");
const conteo = new MesaElectoral();
const ModelMesa = require("../models/MesaElectoral");
class WSService {
  abrirSocket() {
    wss.on("connection", function connection(ws) {
      ws.on("message", function incoming(data) {
        // Revisar
        const jsondata = JSON.parse(data);
        console.log('validando participante')
        const msg = conteo.validarParticipante(
          jsondata.llave,
          jsondata.id,
          jsondata.contrasena
        );
        console.log(msg);
        if (msg.estatus === 0) {
          ws.close();
        } else if (msg.estatus === 1) {
          const presentes = conteo.verPresentes();
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              ModelMesa.obtenerListaCompleta().then((result) => {
                result.forEach((integranteMesa) => {
                  let estatus = 0;
                  presentes.forEach((presente) => {
                    if (presente === integranteMesa.idMesaElectoral) {
                      estatus = 1;
                    }
                  });
                  client.send(
                    JSON.stringify({
                      id: integranteMesa.idMesaElectoral,
                      estatus: estatus,
                    })
                  );
                });
              });
            }
          });
        } else {
          // Ocurrio un error durante el conteo de votos
        }
      });
    });
    server.listen(8080);
    console.log("WSS running");
  }

  comprobarSocket() {
    if (server.listening) {
      return false;
    }
    return true;
  }
}

module.exports = WSService;
