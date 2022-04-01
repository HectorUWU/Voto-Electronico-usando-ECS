const mysql = require("mysql2");

const conexion = mysql.createPool({
  host:  process.env.DB_Host,
  user: process.env.DB_User,
  password: process.env.DB_Password,
  database: process.env.DB_DATABASE,
  timezone: 'Mexico/General',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  debug: false
});

conexion.getConnection((error) => {
    if (error) {
        console.log("El error es " + error);
        return;
    }
    console.log("Conexion completa");
});
module.exports = conexion;