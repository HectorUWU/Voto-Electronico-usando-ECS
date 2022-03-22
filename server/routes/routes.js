const express = require("express");
const Votante = require("../models/Votante");
const MesaElectoral = require("../models/MesaElectoral");
const Votan = require("../services/Votante");
const router = express.Router();
const verificarVotantes = require("./autenticarVotante");
const verificarMesa = require("./autenticarMesa");
const Candidato = require("../models/Candidato");
const Votacion = require("../models/Votacion");
const WSService = require("../services/WSService");
const moment = require("moment");
router.post("/registro", (req, res) => {
  if (req.body) {
    const nuevoVotante = new Votante(req.body);
    Votante.registro(nuevoVotante)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ error: err.toString() });
      });
  } else {
    res.status(400).send({ error: "Campos invalidos" });
  }
});

router.get("/verificar/:token/:id", (req, res) => {
  const { token, id } = req.params;
  Votante.verificarCorreo(token, id)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(401).send({ error: err.toString() });
    });
});

router.post("/login", (req, res) => {
  if (!isNaN(req.body.id)) {
    Votante.iniciarSesion(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ error: err.toString() });
      });
  } else if (isNaN(req.body.idMesa)) {
    MesaElectoral.iniciarSesion(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ error: err.toString() });
      });
  } else {
    res.status(400).send({ error: "Campos invalidos" });
  }
});

router.post("/votar", verificarVotantes, (req, res) => {
  if (req.body) {
    const V = new Votan(req.body.estadoVoto, req.body.estadoAcademico);
    V.votar(req.body.eleccion, 2, 3)
      .then((result) => {
        Votante.modificarEstadoVoto([1, req.body.idVotante]);
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ error: err.toString() });
      });
  }
});

router.post("/validarIntegrante", verificarMesa, (req, res) => {
  if (req.body) {
    try {
      const webSocket = new WSService();
      webSocket.abrirSocket();
      res.status(200).send({ message: "ok" });
    } catch (err) {
      console.log("socket ya abierto");
      res.status(200).send({ message: "ok" });
    }
  }
});

router.get("/verCandidatos", (req, res) => {
  Candidato.obtenerCandidatos()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({ error: err.toString() });
    });
});

router.get("/listaMesa", (req, res) => {
  MesaElectoral.obtenerListaCompleta()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({ error: err.toString() });
    });
});

router.get("/verResultadosUltimaVotacion", (req, res) => {
  Votacion.consultarUltimaVotacion()
    .then((result) => {
      if (result != null) {
        if (result.estado === "finalizado") {
          Candidato.obtenerCandidatos().then((result) => {
            res.send(result);
          });
        } else if (result.estado === "activo") {
          if (moment().isSameOrBefore(moment(result.fechaFin).add(1, "days"))) {
            res.send({
              estado: "activo",
              nombre: result.procesoElectoral,
              fechaInicio: result.fechaInicio,
              fechaFin: result.fechaFin,
            });
          } else {
            res.send({
              estado: "listoParaConteo",
              nombre: result.procesoElectoral,
              fechaInicio: result.fechaInicio,
              fechaFin: result.fechaFin,
            });
          }
        } else {
          res.send({ estado: "inactivo" });
        }
      } else {
        res.send({ estado: "inactivo" });
      }
    })
    .catch((err) => {
      res.status(500).send({ error: err.toString() });
    });
});

router.post("/registroVotacion", verificarMesa, (req, res) => {
  if (req.body) {
    Votacion.establecerVotacion(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ error: err.toString() });
      });
  }
});

router.get("/verEstadoUltimaVotacion", (req, res) => {
  Votacion.consultarUltimaVotacion()
    .then((result) => {
      if (result !== undefined) {
        if (result.estado === "finalizado") {
          res.send({ estado: "finalizado" });
        } else if (result.estado === "activo") {
          if (moment().isSameOrBefore(moment(result.fechaFin).add(1, "days"))) {
            res.send({ estado: "activo" });
          } else {
            res.send({ estado: "listoParaConteo" });
          }
        } else {
          Votacion.consultarNumeroCandidatosUltimaVotacion()
            .then((result) => {
              if (result.candidatos < 2) {
                res.send({ estado: "preparacion" });
              } else {
                res.send({ estado: "listoParaIniciar" });
              }
            })
            .catch((err) => {
              res.status(500).send({ error: err.toString() });
            });
        }
      } else {
        res.send({ estado: "finalizado" });
      }
    })
    .catch((err) => {
      res.status(500).send({ error: err.toString() });
    });
});

router.post("/iniciarVotacion", verificarMesa, (req, res) => {
  if (req.body) {
    if (req.body.estadoVotacion === "listoParaIniciar") {
      Votacion.consultarNumeroCandidatosUltimaVotacion().then((result) => {
        if (result.candidatos < 2) {
          res
            .status(400)
            .send({ error: "El numero de candidatos es menor a 2" });
        } else {
          Votacion.iniciarVotacion(req.body)
            .then((result) => {
              res.send(result);
            })
            .catch((err) => {
              res.status(400).send({ error: err.toString() });
            });
        }
      });
    } else {
      res
        .status(400)
        .send({ error: "No puedes iniciar una votacion activa o finalizada" });
    }
  }
});

module.exports = router;
