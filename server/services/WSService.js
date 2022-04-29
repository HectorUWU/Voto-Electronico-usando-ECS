const WebSocket = require("ws");
const http = require("http");
const server = http.createServer();
const MesaElectoral = require("./MesaElectoral");
const ModelMesa = require("../models/MesaElectoral");
class WSService {
  abrirSocket() {
    const wss = new WebSocket.Server({ server });
    const conteo = new MesaElectoral();
    wss.on("connection", function connection(ws) {
      ws.on("message", function incoming(data) {
        // Revisar
        const jsondata = JSON.parse(data);
        console.log("validando participante");
        let presentes = conteo.verPresentes();
        let estaPresente = false;
        presentes.forEach((participantePresente) => {
          if (participantePresente === jsondata.id) {
            estaPresente = true;
          }
        });

        if (estaPresente === false) {
          conteo
            .validarParticipante(
              jsondata.llave,
              jsondata.id,
              jsondata.contrasena
            )
            .then((result) => {
              console.log(result);
              if (result.estatus === 0) {
                ws.close();
              } else if (result.estatus === 1 || result.estatus === 2) {
                presentes = conteo.verPresentes();
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

                if (result.estatus === 2) {
                  wss.clients.forEach(function each(client) {
                    client.send(JSON.stringify({ msg: result.mensaje }));
                  });

                  setTimeout(function () {
                    wss.close();
                    server.close();
                  }, 5000);
                  // wss.close();
                }
              } else {
                wss.clients.forEach(function each(client) {
                  client.send(JSON.stringify({ error: result.error }));
                });

                setTimeout(function () {
                  wss.close();
                  server.close();
                }, 5000);
              }
            });
        } else {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ msg: "Participante ya registrado" }));
            ModelMesa.obtenerListaCompleta().then((result) => {
              result.forEach((integranteMesa) => {
                let estatus = 0;
                presentes.forEach((presente) => {
                  if (presente === integranteMesa.idMesaElectoral) {
                    estatus = 1;
                  }
                });
                ws.send(
                  JSON.stringify({
                    id: integranteMesa.idMesaElectoral,
                    estatus: estatus,
                  })
                );
              });
            });
          }
        }
      });
    });

    wss.onerror = function (evt) {
      console.log(evt.message);
      wss.close();
      server.close();
    };

    server.listen(8443);
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
