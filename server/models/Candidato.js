/**
 * @fileoverview Candidaro, clase que contiene los metodos para la conexion de los candidatos a la base de datos.
 * @version 1.0
 * @author Perez Barjas Héctor Mauricio
 * @history
 * v.0.1 Agregando conexion y registro de votantes a la base de datos
 */
/** @constructor */
const Candidato = function () {};

const conexion = require("../database/db"); // realiza la conecion a la base de datos.

/**
 * Guarda los resultados de la eleccion en la base de datos
 * @param votos {array[Numero de votos, idCandidato]}
 * @return {promise}
 */
Candidato.registrarVotos = function (votos) {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query("UPDATE candidato SET numeroVotos=? where idCandidato=?", votos)
      .then(([fields, rows]) => {
        resolve({ mensaje: "Resultados guardados con exito" });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Regresa todos los candidatos
 * @return {promise}
 */
Candidato.obtenerCandidatos = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query("SELECT * FROM candidato")
      .then(([fields, rows]) => {
        resolve(fields);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = Candidato; // Exporta el modulo
