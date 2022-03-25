/**
 * @fileoverview Correo, clase que contiene los metodos para el envio de correos.
 * electoral a la base de datos.
 * @version 1.0
 * @author Perez Barjas Héctor Mauricio
 * @history
 * v.1.0 primera version del archivo
 */

const nodemailer = require("nodemailer");// modulo nodemailer, necesario para el envio de correo
/**  @class */
class Correo {
  /** @constructor */ 
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tt2021a002@gmail.com",
        pass: "VotoECS2021A",
      },
    });
  }

/**
 * Metodo que envia una clave privada por correo a una direccion dada
 * @param llavePrivada {string}  
 * @paramcorreo correo  {string} 
 */
  enviarLLave(llavePrivada, correo){
    const mensaje = "Felicidades, miembro de la mesa electoral. Esta es tu llave privada"
    const mailOptions = {
        from: "tt2021a002@gmail.com",
        to: correo,
        subject: "Envio de llave privada",
        text: mensaje,
        attachments: [
          {
            filename: "llave privada.pem",
            content: llavePrivada,
          },
        ],
      };
      this.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email enviado: " + info.response);
        }
      });   
  }

/**
 * Metodo que envia un correo, puede personarlizarse el contenido, el asunto y el correo al que va dirigido
 * @param correo {string}
 * @param mensaje {string}
 * @param asunto {string}
 */
  enviarCorreo(correo, mensaje, asunto){
    const mailOptions = {
        from: "tt2021a002@gmail.com",
        to: correo,
        subject: asunto,
        text: mensaje
      };
      
      this.transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email enviado: " + info.response);
        }
      });
  }
}
module.exports = Correo