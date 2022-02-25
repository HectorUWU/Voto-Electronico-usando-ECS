const express = require("express");
const Votante = require("../models/Votante");
const MesaElectoral = require("../models/MesaElectoral");
const Votan = require('../services/Votante')
const router = express.Router();
const verifyVotantes = require("./autenticarVotante")
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

router.post('/votar', verifyVotantes, (req, res) => {
  if(req.body){
    const V = new Votan(req.body.estadoVoto, req.body.estadoAcademico);
    V.votar(req.body.eleccion, 2, 3).then((result) => {
      res.send(result)
    }).catch((err) => {
      res.status(400).send({ error: err.toString()})
    })
  }
})

module.exports = router;
