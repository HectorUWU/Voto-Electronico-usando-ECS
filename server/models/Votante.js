/**
 * @fileoverview Votante, clase que contiene los metodos para la conexion del votante a la base de datos.
 * @version 1.0
 * @author Perez Barjas Héctor Mauricio
 * @history
 * v.1.0 Agrergando promesas y actualizando elementos a MySQL2. Añadiendo generacion del token de incio de sesion
 * v.0.1 Agregando conexion y registro de votantes a la base de datos
 */
const bcryptjs = require("bcryptjs"); // Modulo bcrypt necesario para cifrar la contrasena
const jwt = require("jsonwebtoken"); // Modulo JWT necesario para la otencion del token

/** @constructor */
const Votante = function (votante) {
  this.boleta = votante.boleta;
  this.idVotante = votante.idVotante;
  this.correo = votante.correo;
  this.contrasena = votante.contrasena;
  this.repetir = votante.repetir;
};
const conexion = require("../database/db"); // realiza la conecion a la base de datos.

/**
 * Verifica la existencia de un votante en la base de datos, buscando por su boleta
 * @param boleta {number}
 * @return {promise}
 */
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

/**
 * Registra un nuevo usuario en la base de datos.
 * @param votante {Votante}
 * @return {Promise}
 */
Votante.registro = function (votante) {
  const sal = 10;
  return new Promise((resolve, reject) => {
    const ipn = votante.correo.split("@");
    if (ipn[1] === "alumno.ipn.mx") {
      console.log(votante.contrasena)
      console.log(JSON.stringify(votante))
      if (votante.contrasena === votante.repetir) {
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
      } else {
        reject(new Error("Las contraseñas no coinciden"));
      }
    } else {
      reject(new Error("Ingresa correo institucional"));
    }
  });
};
/**
 * Inicia sesion como votante un usuario
 * @param votante {Votante}
 * @return {object} // votante y Token
 */
Votante.iniciarSesion = function (votante) {
  return new Promise((resolve, reject) => {
    Votante.buscarPorBoleta(votante.id)
      .then((resultado) => {
        if (!resultado) {
          reject(new Error("Boleta no registrada"));
        } else {
          return Promise.all([
            bcryptjs.compare(votante.contrasena, resultado.contrasena),
            resultado,
          ]);
        }
      })
      .then(([bool, resultado]) => {
        if (bool) {
          const token = jwt.sign(
            {
              boleta: resultado.boleta,
              contrasena: resultado.contrasena,
              rol: "Votante",
            },
            process.env.SECRET,
            { expiresIn: "5h" }
          );
          resolve({ ...resultado, rol: "Votante", token });
        } else {
          reject(new Error("Contraseña incorrecta"));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
module.exports = Votante; // exporta clase votante
