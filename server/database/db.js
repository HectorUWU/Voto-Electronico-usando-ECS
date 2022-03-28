const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host:  process.env.DB_Host,
  user: process.env.DB_User,
  password: process.env.DB_Password,
  database: process.env.DB_DATABASE
});

conexion.connect((error) => {
    if (error) {
        console.log("El error es " + error);
        return;
    }
    console.log("Conexion completa");
});
module.exports = conexion;