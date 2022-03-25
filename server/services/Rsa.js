/**
 * @fileoverview Rsa, clase que contiene los metodos de cifrado y descifrado de rsa
 * @version 1.3
 * @author Kevin Uriel Malvaez Landeros
 * history
 * v.1.0 primera implementacion de las funciones cifrar y descifrar las
 * v.1.1 cambio en el padding a RSA_PKCS1_PADDING y variables a español
 * v.1.2 se agrego la funcion de generar llaves
 * v.1.3 se agrego la funcion de validar llaves privadas
 */

const crypto = require("crypto");// Modulo crypto, necesario para usar rsa
class Rsa {
  constructor (llave) {
    /** 
     * Propiedad que indica la llave publica o privada.
     * @type {string}
    */
    this.llave= llave;
  };

  /**
   * Cifra los datos con llave publica
   * @param datos {string} 
   * @return datosCifrados {string} 
   */
  cifrar(datos) {
    const datosCifrados = crypto.publicEncrypt(
      {
        key: this.llave,
        padding: crypto.constants.RSA_PKCS1_PADDING
      },
      Buffer.from(datos)
    );
    return datosCifrados.toString("base64");
  };

  /**
   * Descifra los datos con la llave privada y la contraseña asociada a esta 
   * @param datos {string} 
   * @param contrasena {string}
   * @return datosDescifrados {string}  
   */
  descifrar(datos, contrasena) {
    try {
      const datosDescifrados = crypto.privateDecrypt(
        {
          key: this.llave,
          padding: crypto.constants.RSA_PKCS1_PADDING,
          passphrase: contrasena,
        },
        Buffer.from(datos, "base64")
      );
      return datosDescifrados.toString();
    } catch(err) {
      return null
    }
  };

  /**
   * Funcion que verifica si la llave privada es valida y la contraseña ingresada es correcta
   * @param contrasena {string}  
   * @returns {boolean}
   */
  validarLlavePrivada(contrasena){
    try{
      crypto.createPrivateKey({  
        key: this.llave,
        format: "pem",
        type: "pkcs8",
        passphrase: contrasena,
        encoding: "utf-8"
      });
      return true
    } catch {
      return false
    }
  }

  /** 
    * @param contrasena {string}, contraseña para la llave privada 
    * @returns publicKey, privateKey {string}
    */
  static generarLLaves(contrasena) {
    const {
      publicKey,
      privateKey,
    } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: contrasena
      }
    
    });
    return ([publicKey, privateKey])
  }
}
module.exports = Rsa;