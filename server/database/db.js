const mysql = require("mysql2");

const conexion = mysql.createPool({
  host:  "localhost",
  user: "root",
  password: "root",
  database: "votoe",
  timezone: '-06:00',
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
