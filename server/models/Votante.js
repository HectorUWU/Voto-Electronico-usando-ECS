const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Votante = function (votante) {
  this.boleta = votante.boleta;
  this.idVotante = votante.idVotante;
  this.correo = votante.correo;
  this.contrasena = votante.contrasena;
};
const conexion = require("../database/db");

Votante.buscarPorBoleta = function (boleta) {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query("SELECT * FROM votante WHERE BOLETA = ?", boleta)
      .then(([fields, rows]) => {
        resolve(fields[0]);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

Votante.registro = function (votante) {
  const sal = 10;
  return new Promise((resolve, reject) => {
    bcryptjs
      .hash(votante.contrasena, sal)
      .then(function (hash) {
        return conexion.promise().query("INSERT INTO votante SET ?", {
          boleta: votante.boleta,
          idVotante: votante.boleta,
          contrasena: hash,
          correo: votante.correo,
        });
      })
      .then(([fields, rows]) => {
        resolve({ mensaje: "Registro exitoso" });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

Votante.iniciarSesion = function (votante) {
  return new Promise((resolve, reject) => {
    Votante.buscarPorBoleta(votante.boleta)
      .then((resultado) => {
        if (!resultado) { 
          reject(new Error("Boleta no registrada"));
        } else {
          return Promise.all(
            [bcryptjs.compare(votante.contrasena, resultado.contrasena),
            resultado]
          );
        }
      })
      .then(([bool, resultado]) => {
        if (bool) {
          const token = jwt.sign(
            { boleta: resultado.boleta },
            process.env.SECRET,
            { expiresIn: "5h" }
          );
          resolve({ ...resultado, token });
        } else {
          reject(new Error("Contraseña incorrecta"));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
module.exports = Votante;
