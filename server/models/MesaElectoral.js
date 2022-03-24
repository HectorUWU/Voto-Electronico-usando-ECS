/**
 * @fileoverview MesaElectoral, clase  anonima que contiene los metodos para la conexion de los integrantes de la mesa
 * electoral a la base de datos.
 * @version 1.0
 * @author Perez Barjas Héctor Mauricio
 * @history
 * v.1.0 primera version del archivo
 */
const bcryptjs = require("bcryptjs"); // Modulo bcrypt necesario para cifrar la contrasena
const jwt = require("jsonwebtoken"); // Modulo JWT necesario para la otencion del token
const Rsa = require("../services/Rsa"); // Modulo RSA, necesario para la optencion de las llaves
const Correo = require("../services/Correo"); // modulo de correo, necesario para el envio de la llave privada
const correo = new Correo(); // instanciando la clase correo

/** @constructor */
const MesaElectoral = function (ME) {
  this.idMesaElectoral = ME.idMesaElectoral;
  this.boleta = ME.boleta;
  this.correo = ME.correo;
  this.contrasena = ME.contrasena;
  this.clavePublica = ME.clavePublica;
};

const conexion = require("../database/db"); // realiza la conecion a la base de datos.

/**
 * Verifica la existencia de un miembro de la mesa electoral en la base de datos, buscando por su id
 * @param id {number}
 * @return {promise}
 */
MesaElectoral.buscarPorID = function (id) {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query("SELECT * FROM mesaelectoral WHERE idMesaElectoral = ?", id)
      .then(([fields, rows]) => {
        resolve(fields[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

MesaElectoral.obtenerListaCompleta = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query("SELECT * FROM mesaelectoral")
      .then(([fields, rows]) => {
        resolve(fields);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

MesaElectoral.obtenerLLavesPublicas = function () {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query("SELECT idMesaElectoral, clavePublica FROM mesaelectoral")
      .then(([fields, rows]) => {
        resolve(fields);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Registra un nuevo miembro de la mesa electoral en la base de datos.
 * @param mesaelectoral {Mesaelectoral}
 * @return {Promise}
 */
MesaElectoral.registrar = function (mesaelectoral) {
  const sal = 10;
  const [publica, privada] = Rsa.generarLLaves(mesaelectoral.contrasena);
  return new Promise((resolve, reject) => {
    bcryptjs
      .hash(mesaelectoral.contrasena, sal)
      .then(function (hash) {
        return conexion.promise().query("INSERT INTO mesaelectoral SET ?", {
          boleta: mesaelectoral.boleta,
          idmesaelectoral: mesaelectoral.idMesaElectoral,
          contrasena: hash,
          correo: mesaelectoral.correo,
          clavePublica: publica,
        });
      })
      .then(([fields, rows]) => {
        correo.enviarLLave(privada, mesaelectoral.correo);
        resolve({ mensaje: "Registro exitoso" });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Inicia sesion como integrante de la mesa electoral un usuario
 * @param votante {mesaelectoral}
 * @return {object} // votante y Token
 */
MesaElectoral.iniciarSesion = function (me) {
  return new Promise((resolve, reject) => {
    MesaElectoral.buscarPorID(me.id)
      .then((resultado) => {
        if (!resultado) {
          reject(new Error("Integrante de la mesa no valido"));
        } else {
          return Promise.all([
            bcryptjs.compare(me.contrasena, resultado.contrasena),
            resultado,
          ]);
        }
      })
      .then(([bool, resultado]) => {
        if (bool) {
          const token = jwt.sign(
            {
              idMesaElectoral: resultado.idMesaElectoral,
              contrasena: resultado.contrasena,
              rol: "MesaElectoral",
            },
            process.env.SECRET,
            { expiresIn: "5h" }
          );
          resolve({ ...resultado, rol: "MesaElectoral", token });
        } else {
          reject(new Error("Contraseña incorrecta"));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};
module.exports = MesaElectoral;
