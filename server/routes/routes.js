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
    const webSocket = new WSService();
    const seDebeCrearSocket = webSocket.comprobarSocket();
    if (seDebeCrearSocket) {
      webSocket.abrirSocket();
      res.status(200).send({ message: "ok" });
    } else {
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
  Votacion.verEstadoUltimaVotacion()
    .then((result) => {
      if (result.estado === "finalizado") {
        Candidato.verResultadosUltimaVotacion().then((result) => {
          res.send(result);
        });
      } else if (result.estado === "activo") {
        res.send({ resultado: true });
      } else {
        res.send({ resultado: false });
      }
    })
    .catch((err) => {
      res.status(500).send({ error: err.toString() });
    });
});

module.exports = router;
