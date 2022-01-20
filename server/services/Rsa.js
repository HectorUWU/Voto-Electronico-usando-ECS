/**
 * @fileoverview Rsa, clase que contiene los metodos de cifrado y descifrado de rsa
 * @version 1.1
 * @author Kevin Uriel Malvaez Landeros
 * history
 * v.1.0 primera implementacion de las funciones cifrar y descifrar las
 * v.1.1 cambio en el padding a RSA_PKCS1_PADDING y variables a español
 */

const crypto = require("crypto");// Modulo crypto, necesario para usar rsa

/** @constructor */
const Rsa = function (rsa) {
  /** 
   * Propiedad que indica la llave publica
   * @type {string}
  */
  this.llavePublica = rsa.llavePublica;
  /** 
   * Propiedad que indica la llave privada
   * @type {string}
  */
  this.llavePrivada = rsa.llavePrivada;
};

/**
 * Cifra los datos con llave publica
 * @param llavePublica {string} 
 * @param datos {string} 
 * @return datosCifrados {string} 
 */
Rsa.cifrar = function (llavePublica, datos) {
  const datosCifrados = crypto.publicEncrypt(
    {
      key: llavePublica,
      padding: crypto.constants.RSA_PKCS1_PADDING
    },
    Buffer.from(datos)
  );
  return datosCifrados.toString("base64");
};

/**
 * Descifra los datos con la llave privada y la contraseña asociada a esta
 * @param llavePrivada {string} 
 * @param datos {string} 
 * @param contrasena {string}
 * @return datosDescifrados {string}  
 */
Rsa.descifrar = function (llavePrivada, datos, contrasena) {
  const datosDescifrados = crypto.privateDecrypt(
    {
      key: llavePrivada,
      padding: crypto.constants.RSA_PKCS1_PADDING,
      passphrase: contrasena,
    },
    Buffer.from(datos, "base64")
  );
  return datosDescifrados.toString();
};

module.exports = Rsa;