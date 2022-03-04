const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'votoe'
});

conexion.connect((error) => {
    if (error) {
        console.log("El error es " + error);
        return;
    }
    console.log("Conexion completa");
});
module.exports = conexion;