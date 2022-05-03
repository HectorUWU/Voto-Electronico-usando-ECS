/**
 * @fileoverview Votante, clase que contiene los metodos para la conexion del votante a la base de datos.
 * @version 2.0
 * @author Perez Barjas Héctor Mauricio
 * @history
 * v 2.0 Añadiendo modificacion de estado del voto y confirmacion por correo electronico del registro
 * v.1.0 Agrergando promesas y actualizando elementos a MySQL2. Añadiendo generacion del token de incio de sesion
 * v.0.1 Agregando conexion y registro de votantes a la base de datos
 */
const bcryptjs = require("bcryptjs"); // Modulo bcrypt necesario para cifrar la contrasena
const jwt = require("jsonwebtoken"); // Modulo JWT necesario para la otencion del token
const Correo = require("../services/Correo"); // Modulo necesario para el envio de la confirmacion por correo
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
      // Solo acepta correo institucional
      if (votante.contrasena === "") {
        reject(new Error("La contraseña no debe estar vacia"));
      } else {
        if (votante.contrasena === votante.repetir) {
          bcryptjs
            .hash(votante.contrasena, sal)
            .then(function (hash) {
              return conexion.promise().query("INSERT INTO votante SET ?", {
                boleta: votante.boleta,
                idVotante: votante.boleta,
                contrasena: hash,
                correo: votante.correo,
                estadoVoto: 0, // Se asigna como si no ubiera votado
                estadoAcademico: 0, // Se asume que no esta inscrito hasta que se demuestre lo contrario
                verificacion: "Pendiente",
              });
            })
            .then(([fields, rows]) => {
              const token = jwt.sign(
                { correo: votante.correo, id: votante.boleta },
                process.env.SECRET
              );
              const link =
                "https://vota-escom.herokuapp.com/verificar/" +
                token +
                "/" +
                votante.boleta; // Crea el link para la verificacion
              const correo = new Correo();
              correo.enviarCorreo(
                votante.correo,
                "Para continuar verifica tu cuenta en el siguiente link\n" +
                  link,
                "Verificacion de correo VOTA-ESCOM"
              );
              resolve({ mensaje: "Registro exitoso" });
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(new Error("Las contraseñas no coinciden"));
        }
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
        } else if (resultado.verificacion === "Pendiente") {
          reject(new Error("Cuenta no verificada"));
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

/**
 * Modifica el estado del voto
 * @param votante {array[Nuendo estado voto{int}, IdVotante{int}]}
 * @return {Promise}
 */
Votante.modificarEstadoVoto = function (votante) {
  return new Promise((resolve, reject) => {
    conexion
      .promise()
      .query("UPDATE votante SET estadoVoto=? where idVotante=?", votante)
      .then(([fields, rows]) => {
        resolve({ mensaje: "Estado Actualizado" });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Verifica a un usuario
 * @param token {string}
 * @param id {int}
 * @return {Promise}
 */
Votante.verificarCorreo = async function (token, id) {
  return new Promise((resolve, reject) => {
    Votante.buscarPorBoleta(id)
      .then((result) => {
        if (!result) {
          reject(new Error("Boleta no registrada"));
        } else if (result.verificacion === "Verificado") {
          reject(new Error("Usuario ya verificado"));
        } else {
          const verificacion = jwt.verify(token, process.env.SECRET);
          if (id !== verificacion.id) {
            reject(new Error("Token invalido"));
          } else {
            conexion
              .promise()
              .query(
                "UPDATE votante SET verificacion = 'Verificado' WHERE idVotante= ?",
                id
              )
              .then(([fields, rows]) => {
                resolve({ mensaje: "Verificacion Exitosa" });
              });
          }
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

Votante.cambiarContrasena = function (votante) {
  return new Promise((resolve, reject) => {
    Votante.buscarPorBoleta(votante.id)
      .then((resultado) => {
        if (!resultado) {
          reject(new Error("Boleta no registrada"));
        } else if (resultado.verificacion === "Pendiente") {
          reject(new Error("Cuenta no verificada"));
        } else {
          return Promise.all([
            bcryptjs.compare(votante.contrasena, resultado.contrasena),
            resultado,
          ]);
        }
      })
      .then(([bool, resultado]) => {
        if (bool) {
          console.log(votante.nuevaContrasena)
          if (votante.nuevaContrasena === votante.repetir) {
            bcryptjs
              .hash(votante.nuevaContrasena, 10)
              .then(function (hash) {
                return conexion.promise().query(
                  "UPDATE votante SET contrasena = ? WHERE idVotante = ?",
                  [hash, votante.id]
                );
              })
              .then(([fields, rows]) => {
                resolve({ mensaje: "Contraseña Actualizada" });
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            reject(new Error("Las contraseñas no coinciden"));
          }
        } else {
          reject(new Error("Contraseña incorrecta"));
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}
// funcion que envia token para cambio de contraseña para votante
Votante.enviarToken = function (votante) {
  return new Promise((resolve, reject) => {
    Votante.buscarPorBoleta(votante.id)
      .then((resultado) => {
        if (!resultado) {
          reject(new Error("Boleta no registrada"));
        } else if (resultado.verificacion === "Pendiente") {
          reject(new Error("Cuenta no verificada"));
        } else {
            const token = jwt.sign( // genera token
              {
                id: resultado.boleta,
                contrasena: resultado.contrasena,
                correo: resultado.correo
              },
              process.env.SECRET,
              { expiresIn: "1h" }
            );
            const link = 
            "http://localhost:3000/recuperarContrasena/" + token + "/" + votante.id;
            const correo = new Correo();
            correo.enviarCorreo(resultado.correo,
              "Para restablecer tu contraseña favor de entrar en el siguiente link\n" +
                  link+"\n Si no has sido tu, no debes de hacer nada." ,
              "Recuperar Contraseña");
            resolve({ mensaje: "Token enviado" });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// funcion que verifica el token y restablece la contraseña del votante
Votante.restablecerContrasena = function (token, id, votante) {
  return new Promise((resolve, reject) => {
    Votante.buscarPorBoleta(id)
      .then((resultado) => {
        if (!resultado) {
          reject(new Error("Boleta no registrada"));
        } else if (resultado.verificacion === "Pendiente") {
          reject(new Error("Cuenta no verificada"));
        } else {
          const verificacion = jwt.verify(token, process.env.SECRET);
          if (id !== verificacion.id.toString()) {
            reject(new Error("Token invalido"));
          } else { 
            if(resultado.contrasena !== verificacion.contrasena) {
              reject(new Error("Este token ya ha sido utilizado"))
            } else {  // si el token es valido
              if(votante.contrasena !== votante.repetir){
                reject(new Error("Las contraseñas no coinciden"))
              } else {    
                bcryptjs
                  .hash(votante.contrasena, 10) // encripta la contraseña
                  .then(function (hash) {
                    return conexion.promise().query(
                      "UPDATE votante SET contrasena = ? WHERE idVotante = ?",
                      [hash, id]
                    );
                  })
                  .then(([fields, rows]) => {
                    resolve({ mensaje: "Contraseña Actualizada" });
                  })
                  .catch((error) => {
                    reject(error);
                  });
              }
            }
          }
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = Votante; // exporta clase votante
