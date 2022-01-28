const conexion = require("../database/db"); // realiza la conecion a la base de datos.

const Fragmento = function () {};

Fragmento.guardarFragmentos = function (fragmentos) {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query(
        "INSERT INTO voto (idFragmento, fragmento, idMesaElectoral) VALUES ?",
        [fragmentos]
      )
      .then(([fields, rows]) => {
        resolve({ mensaje: "Fragmentos guardados con exito" })
      }).catch((_err) => {
        reject(_err);
      })
    });
  };


Fragmento.optenerFragmentos = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query("SELECT * FROM voto")
      .then(([fields, rows]) => {
        resolve(fields);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = Fragmento;
