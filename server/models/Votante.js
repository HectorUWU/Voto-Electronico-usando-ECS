const bcryptjs = require('bcryptjs');
const Votante = function(votante){
    this.boleta = votante.boleta;
    this.idVotante = votante.idVotante;
    this.correo = votante.correo;
    this.contrasena = votante.contrasena;
}
const conexion = require('../database/db')

Votante.buscarPorBoleta = function(boleta, resultados){
    conexion.query('SELECT * FROM votante WHERE BOLETA = ?', boleta, (error, results)=>{
        if(error){
            console.log(error);
        }else{
            resultados(results)
        }
    })
}

Votante.registro = function(votante, resultados){
    const sal = 10
    bcryptjs.hash(votante.contrasena, sal).then(function(hash){
        conexion.query('INSERT INTO votante SET ?', {boleta:votante.boleta, idVotante:votante.boleta, 
            contrasena:hash, correo:votante.correo}, (error, results)=>{
                if(error){
                    console.log(error)
                    resultados(error, null)
                }else{
                    resultados(null, results)
                }
            })
    })
}

Votante.iniciarSesion = function(votante, resultados){
    Votante.buscarPorBoleta(votante.boleta, (error, resultado)=>{
        if(error){
            console.log(error)
            resultados(error, null)
        }else{
            if(resultados.length === 0){
                resultados('Boleta no registrada', null)
            }
            else{
                bcryptjs.compare(votante.contrasena, resultado[0].contrasena).then((err, bool)=>{
                    if(err){
                        resultados(err, null)
                    }else if(bool){
                        // TO DO
                        console.log("Contrasena corrercta")
                    }else{
                        resultados("Contraseña incorrrecta", null)
                    }
                })
            }
        }
    })
}
module.exports = Votante