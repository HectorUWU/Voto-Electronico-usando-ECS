/**
 * @fileoverview Fragmento, clase que contiene los metodos para la conexion de los fragmentos a la base de datos.
 * @version 1.0
 * @author Perez Barjas Héctor Mauricio
 * @history
 * v.0.1 Agregando conexion guardarFragmentos y obtenerFragmentos
 */

const conexion = require("../database/db"); // realiza la conecion a la base de datos.
/** @constructor */
const Fragmento = function () {};

/**
 * Guarda los fragmentos de un voto en la base de datos
 * @param votos {Array de arryas}
 * @return {promise}
 */
Fragmento.guardarFragmentos = function (fragmentos) {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query(
        "INSERT INTO voto (idFragmento, fragmento, idMesaElectoral) VALUES ?",
        [fragmentos]
      )
      .then(([fields, rows]) => {
        resolve({ mensaje: "Fragmentos guardados con exito" });
      })
      .catch((_err) => {
        reject(_err);
      });
  });
};

/**
 * Regresa los fragmentos de los votos de los candidatos presentes
 * @param votos {array}
 * @return {promise}
 */
Fragmento.obtenerFragmentos = function (id) {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query("SELECT * FROM voto WHERE idMesaElectoral IN (?);", [id])
      .then(([fields, rows]) => {
        resolve(fields);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = Fragmento; // Exporta el modulo
