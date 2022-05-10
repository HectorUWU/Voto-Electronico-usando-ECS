const express = require("express");
const Votante = require("../models/Votante");
const MesaElectoral = require("../models/MesaElectoral");
const Votan = require("../services/Votante");
const router = express.Router();
const verificarVotantes = require("./autenticarVotante");
const verificarMesa = require("./autenticarMesaElectoral");
const Candidato = require("../models/Candidato");
const Votacion = require("../models/Votacion");
const moment = require("moment");
const cloudinary = require("cloudinary");

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
    Votacion.getUmbral()
    .then((result) => {
      const V = new Votan(req.body.estadoVoto, req.body.estadoAcademico);
      console.log(result)
      V.votar(req.body.eleccion, result.umbral, result.participantes)
        .then((result) => {
          // Votante.modificarEstadoVoto([1, req.body.idVotante]);
          res.send(result);
        })
    })
      .catch((err) => {
        res.status(500).send({ error: err });
      });
  }
});

router.post("/validarIntegrante", verificarMesa, (req, res) => {
  if (req.body.llave && req.body.contrasena !== "") {
    MesaElectoral.validarContra(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ error: err.toString() });
      });
  } else {
    res
      .status(400)
      .send({ error: "Por favor ingrese la información solicitada" });
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

router.post("/subir", verificarMesa, (req, res) => {
  cloudinary.config({
    cloud_name: "dc4qypsso",
    api_key: "527656637747284",
    api_secret: "ettQEDQ1KKs9503Utxub-T7dIqw",
  });
  cloudinary.uploader.upload(req.body.file).then((result) => {
    console.log(result);
    res
      .status(200)
      .send(result)
      .catch((err) => {
        res.status(500).send({ error: err.toString() });
      });
  });
});

router.post("/registrarCandidato", verificarMesa, (req, res) => {
  if (req.body) {
    const nuevoCandidato = new Candidato(req.body);
    Candidato.registro(nuevoCandidato)
      .then((results) => {
        res.send(results);
      })
      .catch((error) => {
        res.status(500).send({ error: error.toString() });
      });
  }
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
          if (
            moment()
              .utc()
              .isSameOrBefore(moment(result.fechaFin).utc().add(1, "days"))
          ) {
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
  } else {
    res.status(400).send({ error: "Campos invalidos" });
  }
});

router.get("/verEstadoUltimaVotacion", (req, res) => {
  Votacion.consultarUltimaVotacion()
    .then((result) => {
      if (result !== undefined) {
        if (result.estado === "finalizado") {
          res.send({ estado: "finalizado" });
        } else if (
          result.estado === "activo" ||
          result.estado === "conteo listo"
        ) {
          if (
            moment()
              .utc()
              .isSameOrBefore(moment(result.fechaFin).utc().add(1, "days"))
          ) {
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

router.post("/publicarResultados", verificarMesa, (req, res) => {
  Votacion.consultarUltimaVotacion().then((result) => {
    if (result.estado !== "finalizado") {
      Votacion.publicarResultados()
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.status(500).send({ error: err.toString() });
        });
    } else {
      res.status(400).send({
        error: "Ya se han publicado los resultados",
      });
    }
  });
});

router.post("/cambiarContrasenaVotante", verificarVotantes, (req, res) => {
  if (req.body) {
    Votante.cambiarContrasena(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ error: err.toString() });
      });
  } else {
    res.status(400).send({ error: "No se han podido cambiar la contrasena" });
  }
});

router.post("/cambiarContrasenaMesa", verificarMesa, (req, res) => {
  if (req.body) {
    MesaElectoral.cambiarContrasena(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(400).send({ error: err.toString() });
      });
  } else {
    res.status(400).send({ error: "No se han podido cambiar la contrasena" });
  }
});

router.post("/enviarToken", (req, res) => {
  if (req.body) {
    if (!isNaN(req.body.id)) {
      Votante.enviarToken(req.body)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.status(400).send({ error: err.toString() });
        });
    } else {
      if (isNaN(req.body.id)) {
        MesaElectoral.enviarToken(req.body)
          .then((result) => {
            res.send(result);
          })
          .catch((err) => {
            res.status(400).send({ error: err.toString() });
          });
      }
    }
  } else {
    res.status(400).send({ error: "No se han podido enviar el token" });
  }
});

router.post("/recuperarContrasena/:token/:id", (req, res) => {
  const { token, id } = req.params;

  if (req.body) {
    if (!isNaN(id)) {
      Votante.restablecerContrasena(token, id, req.body)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.status(400).send({ error: err.toString() });
        });
    } else {
      MesaElectoral.restablecerContrasena(token, id, req.body)
        .then((result) => {
          res.send(result);
        })
        .catch((err) => {
          res.status(400).send({ error: err.toString() });
        });
    }
  } else {
    res.status(400).send({ error: "No se han podido cambiar la contrasena" });
  }
});

router.get("/revisarConteo", (req, res) => {
  Votacion.verEstadoUltimaVotacion().then((result) => {
    if (result.estado === "conteo listo") {
      res.send({ message: "ok" });
    }
  });
});

module.exports = router;
