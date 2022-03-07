/**
 * @fileoverview Votacion, clase que contiene los metodos para la conexion de las votaciones a la base de datos.
 * @version 1.0
 * @author Malvaez Landeros Kevin Uriel
 * @history
 * v.0.1 Agregando conexion y consulta de la ultima votacion a la base de datos
 */
/** @constructor */
const Votacion = function (votante) {

};
const conexion = require("../database/db"); // realiza la conecion a la base de datos.

Votacion.verEstadoUltimaVotacion = function () {
    return new Promise((resolve, reject) => {
      conexion
        .promise()
        .query("SELECT estado FROM votacion WHERE idVotacion=(SELECT MAX(idVotacion) FROM votacion)")
        .then(([fields, rows]) => {
          resolve(fields[0]);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  module.exports = Votacion;