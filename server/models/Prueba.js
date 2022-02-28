const conexion = require("../database/db");
const Prueba = function() {};
Prueba.probar = function() {
    return new Promise((resolve, reject) => {
        conexion
            .promise()
            .query("SELECT * FROM mesaelectoral;")
            .then(([fields, rows]) => {
                // console.log(rows)
                console.log(fields)
            })
            .catch((err) => {
                reject(err);
            });
    });
};

Prueba.probar()