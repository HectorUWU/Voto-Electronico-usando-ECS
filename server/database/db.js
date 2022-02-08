const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: "ubuntu.mysql.database.azure.com",
  user: "tt",
  password: "VotoECS2021A",
  database: "votoe"
});

conexion.connect((error) => {
  if (error) {
    console.log("El error es " + error);
    return;
  }
  console.log("Conexion completa");
});
module.exports = conexion;
