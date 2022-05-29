/**
 * @fileoverview Votacion, clase que contiene los metodos para la conexion de las votaciones a la base de datos.
 * @version 1.0
 * @author Malvaez Landeros Kevin Uriel
 * @history
 * v 1.0 Agregando inserciones de votaciones, consultas de la informacion y actualizacion del estado de la votacion
 * v.0.1 Agregando conexion y consulta de la ultima votacion a la base de datos
 */
/** @constructor */
const Votacion = function (votante) {};
const conexion = require("../database/db"); // realiza la conecion a la base de datos.
const moment = require("moment"); // libreria usada para la manipulacion de fechas

/**
 * Consulta el estado de la ultima votacion
 * @returns {promise}
 */
Votacion.verEstadoUltimaVotacion = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query(
        "SELECT estado FROM votacion WHERE idVotacion=(SELECT MAX(idVotacion) FROM votacion)"
      )
      .then(([fields, rows]) => {
        resolve(fields[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Realiza la insercion de una nueva votacion
 * @param votacion {Object}
 * @returns {promise}
 */
Votacion.establecerVotacion = function (votacion, numMesa) {
  return new Promise((resolve, reject) => {
    if (votacion.nombre !== "") {
      // Solo acepta que la fecha de fin sea mayor a la de la fecha de inicio y que sea mayor a la fecha actual
      if (
        (moment(votacion.fechaFin).utc() > moment(votacion.fechaInicio).utc()) &
        (moment(votacion.fechaInicio).utc() > moment().utc())
      ) {
        // Solo acepta que el numero de umbral sea mayor o igual a 2 y que sea menor al numero de participantes
        if (
          (votacion.umbral > numMesa) |
          (votacion.umbral < 2)
        ) {
          reject(
            new Error(
              "El numero de umbral no puede ser mayor al numero de integrantes de la mesa = "+numMesa+", ni menor a 2"
            )
          );
        } else {
          conexion
            .promise()
            .query("INSERT INTO votacion SET ?", {
              procesoElectoral: votacion.nombre,
              fechaInicio: votacion.fechaInicio,
              fechaFin: votacion.fechaFin,
              estado: "preparacion",
              participantes: numMesa,
              umbral: votacion.umbral,
            })
            .then(([fields, rows]) => {
              Votacion.limpiarVotos().then(() => {
                resolve({ mensaje: "Registro exitoso" });
              });
            })
            .catch((err) => {
              console.log(err);
              reject(err);
            });
        }
      } else {
        reject(
          new Error(
            "La fecha de inicio debe ser mayor a la fecha de fin y mayor a la fecha actual"
          )
        );
      }
    } else {
      reject(new Error("Debe escribir un nombre para la votacion"));
    }
  });
};

/**
 * Consulta de la ultima votacion los campos de procesoElectoral, fechaInicio, fechaFin, estado
 * @returns {promise}
 */
Votacion.consultarUltimaVotacion = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query(
        "SELECT procesoElectoral, fechaInicio, fechaFin, estado FROM votacion WHERE idVotacion=(SELECT MAX(idVotacion) FROM votacion)"
      )
      .then(([fields, rows]) => {
        resolve(fields[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Consulta el numero de candidatos que estan registrados a la ultima votacion
 * @returns {promise}
 */
Votacion.consultarNumeroCandidatosUltimaVotacion = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query(
        "SELECT COUNT(*) AS candidatos FROM candidato WHERE idVotacion=(SELECT MAX(idVotacion) FROM votacion);"
      )
      .then(([fields, rows]) => {
        resolve(fields[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Actualiza el estado de la votacion a activo
 * @returns {promise}
 */
Votacion.iniciarVotacion = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query(
        "UPDATE votacion SET ? WHERE idVotacion=(SELECT MAX(v.idVotacion) FROM (SELECT * FROM votacion) as v);",
        {
          estado: "activo",
        }
      )
      .then(([fields, rows]) => {
        resolve({ mensaje: "Votacion iniciada con exito" });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

Votacion.limpiarVotos = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query("DELETE FROM voto;")
      .then(([fields, rows]) => {
        resolve(fields[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};


/**
 * Consulta el umbral de la ultima votación
 * @returns {promise}
 */
Votacion.getUmbral = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query("SELECT participantes, umbral FROM votacion WHERE idVotacion=(SELECT MAX(idVotacion) FROM votacion)")
      .then(([fields, rows]) => {
        resolve(fields[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Actualiza el estado de la votacion a finalizado para bublicar los resultados
 * @returns {promise}
 */
 Votacion.publicarResultados = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query(
        "UPDATE votacion SET ? WHERE idVotacion=(SELECT MAX(v.idVotacion) FROM (SELECT * FROM votacion) as v);",
        {
          estado: "finalizado",
        }
      )
      .then(([fields, rows]) => {
        resolve({ mensaje: "Resultados publicados con exito" });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

Votacion.finalizarConteo = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query(
        "UPDATE votacion SET ? WHERE idVotacion=(SELECT MAX(v.idVotacion) FROM (SELECT * FROM votacion) as v);",
        {
          estado: "conteo listo",
        }
      )
      .then(([fields, rows]) => {
        resolve({ mensaje: "Resultados contados" });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = Votacion;
