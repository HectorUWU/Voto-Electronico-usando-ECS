const Candidato = function () {};

const conexion = require("../database/db"); // realiza la conecion a la base de datos.

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

module.exports = Candidato;
