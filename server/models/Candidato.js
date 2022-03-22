/**
 * @fileoverview Candidaro, clase que contiene los metodos para la conexion de los candidatos a la base de datos.
 * @version 1.0
 * @author Perez Barjas Héctor Mauricio
 * @history
 * v.0.1 Agregando conexion y registro de votantes a la base de datos
 */
/** @constructor */
const Candidato = function (candidato) {
  this.nombre = candidato.nombre;
  this.correo = candidato.correo;
  this.link = candidato.link;
  this.foto = candidato.foto;
};
const conexion = require("../database/db"); // realiza la conecion a la base de datos.
Candidato.buscarPorCorreo = function (correo) {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query("SELECT * FROM candidato WHERE correo = ?", correo)
      .then(([fields, rows]) => {
        resolve(fields[0]);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

Candidato.registro = function (candidato) {
  return new Promise((resolve, reject) => {
    Candidato.buscarPorCorreo(candidato.correo).then((results) => {
      if(results){
      reject(new Error("Candidato ya registrado"));
    }else {
      conexion
        .promise()
        .query(
          "(SELECT idVotacion from votacion where estado='Preparando' LIMIT 1)"
        )
        .then(([fields, rows]) => {
          conexion
            .promise()
            .query("INSERT INTO candidato SET ?", {
              nombre: candidato.nombre,
              correo: candidato.correo,
              linkPlanTrabajo: candidato.link,
              foto: candidato.foto,
              numeroVotos: 0, // Se asigna como si no ubiera votado
              resultado: 0, // Se asume que no esta inscrito hasta que se demuestre lo contrario
              idVotacion: fields[0].idVotacion,
            })
            .then(([fields, rows]) => {
              resolve({ mensaje: "Registro exitoso" });
            });
        })
        .catch((error) => {
          reject(error);
        });
    }
  })
  });
};

/**
 * Guarda los resultados de la eleccion en la base de datos
 * @param votos {array[Numero de votos, resultado, idCandidato]}
 * @return {promise}
 */
Candidato.registrarVotos = function (votos) {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query(
        "UPDATE candidato SET numeroVotos=?, resultado=? where idCandidato=?",
        votos
      )
      .then(([fields, rows]) => {
        resolve({ mensaje: "Resultados guardados con exito" });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Regresa todos los candidatos de la ultima votacion
 * @return {promise}
 */
Candidato.obtenerCandidatos = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query(
        "SELECT * FROM candidato WHERE idVotacion=(SELECT MAX(idVotacion) FROM votacion)"
      )
      .then(([fields, rows]) => {
        resolve(fields);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
module.exports = Candidato; // Exporta el modulo