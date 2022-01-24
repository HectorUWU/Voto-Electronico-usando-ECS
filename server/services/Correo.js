const nodemailer = require("nodemailer");

class Correo {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tt2021a002@gmail.com",
        pass: "VotoECS2021A",
      },
    });
  }

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