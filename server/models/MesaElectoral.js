const bcryptjs = require("bcryptjs"); // Modulo bcrypt necesario para cifrar la contrasena
// const jwt = require("jsonwebtoken"); // Modulo JWT necesario para la otencion del token

const MesaElectoral = function (ME) {
  this.idMesaElectoral = ME.idMesaElectoral;
  this.boleta = ME.boleta;
  this.correo = ME.correo;
  this.contrasena = ME.contrasena;
  this.clavePublica = ME.clavePublica;
};

const conexion = require("../database/db"); // realiza la conecion a la base de datos.

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

MesaElectoral.registrar = function(mesaelectoral){
  const sal = 10;
  return new Promise((resolve, reject) => {
    bcryptjs
      .hash(mesaelectoral.contrasena, sal)
      .then(function (hash) {
        return conexion.promise().query("INSERT INTO mesaelectoral SET ?", {
          boleta: mesaelectoral.boleta,
          idmesaelectoral: mesaelectoral.idMesaElectoral,
          contrasena: hash,
          correo: mesaelectoral.correo,
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
