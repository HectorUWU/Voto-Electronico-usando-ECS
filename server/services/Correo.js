/**
 * @fileoverview Correo, clase que contiene los metodos para el envio de correos.
 * electoral a la base de datos.
 * @version 1.0
 * @author Perez Barjas Héctor Mauricio
 * @history
 * v.1.0 primera version del archivo
 */

 const { google } = require("googleapis");
 const OAuth2 = google.auth.OAuth2;
 const nodemailer = require("nodemailer"); // modulo nodemailer, necesario para el envio de correo
 /**  @class */
 class Correo { 
   async creaTransporte() {
     const oauth2Client = new OAuth2(
       '568226944879-64ttn7a0vj72lmhevgslsfa0p6c51let.apps.googleusercontent.com',
       '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',
       "https://developers.google.com/oauthplayground"
     );
   
     oauth2Client.setCredentials({
       refresh_token: '1//0fyMfi5UGhzDFCgYIARAAGA8SNwF-L9IrZwA-xDCTpRPM418AzxkQqoJ1qMktXg13vouRS5STyMIQAdy0yRNk9inb0JFm69aHmJg',
     });
   
     const accessToken = await new Promise((resolve, reject) => {
       oauth2Client.getAccessToken((err, token) => {
         if (err) {
           reject(err);
         }
         resolve(token);
       });
     });
   
     const transporter = nodemailer.createTransport({
       service: "gmail",
       auth: {
         type: "OAuth2",
         user: 'tt2021a002@gmail.com',
         accessToken,
         clientId: '64ttn7a0vj72lmhevgslsfa0p6c51let.apps.googleusercontent.com',
         clientSecret: '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',
         refreshToken: '1//0fyMfi5UGhzDFCgYIARAAGA8SNwF-L9IrZwA-xDCTpRPM418AzxkQqoJ1qMktXg13vouRS5STyMIQAdy0yRNk9inb0JFm69aHmJg',
       },
     });
   
     return transporter;
   }
 
   /**
    * Metodo que envia una clave privada por correo a una direccion dada
    * @param llavePrivada {string}
    * @paramcorreo correo  {string}
    */
   async enviarLLave(llavePrivada, correo) {
     const mensaje =
       "Felicidades, miembro de la mesa electoral. Esta es tu llave privada";
     const mailOptions = {
       subject: "Envio de llave privada",
       text: mensaje,
       to: correo,
       from: 'tt2021a002@gmail.com',
       attachments: [
         {
           filename: "llave privada.pem",
           content: llavePrivada,
         },
       ],
     };
 
     const emailTransporter = await this.creaTransporte();
     await emailTransporter.sendMail(mailOptions, function (error, info) {
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
   async enviarCorreo(correo, mensaje, asunto) {
     const mailOptions = {
       subject: asunto,
       text: mensaje,
       to: correo,
       from: 'tt2021a002@gmail.com',
     };
 
     const emailTransporter = await this.creaTransporte();
     await emailTransporter.sendMail(mailOptions, function (error, info) {
       if (error) {
         console.log(error);
       } else {
         console.log("Email enviado: " + info.response);
       }
     });
   }
 }
 
 module.exports = Correo;
