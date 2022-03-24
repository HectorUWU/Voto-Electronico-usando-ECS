/** 
 * @fileoverview Votacion, Clase que contiene los métodos para el conteo de votos
 * @version 1.0
 * @author Alondra Jacqueline Jacinto Sánchez
 * history 
 * v.1.0 Se crean funciones contarVotos y obtenerFrecuencia
 */

class Votacion {
    /** 
     * Cuenta los votos y retorna resultados
     * @param votos {number array}, arreglo con el valor del ID del candidato por el que se votó
     * @return resultados {Candidato array}, arreglo de objetos tipo Candidato 
     */
    contarVotos(votos) {
        const candidatos = new Set(votos);
        const resultados = []
        for (const item of candidatos) {
            resultados.push({ id: item, votos: this.obtenerFrecuencia(votos, item) })
                // resultados.push(new Candidato(item, this.obtenerFrecuencia(votos, item)))
        }
        return this.decidirCandidatosElectos(resultados)
    }

    /** 
     * Establece el estatus ganador para los candidatos electos
     * @param resultados {Candidato array}, arreglo de Candidatos con el id y conteo de votos
     * @return resultadosFinales {Candidato array}, arreglo de Candidatos con el id, conteo de votos y estatus
     */
    decidirCandidatosElectos(resultados){
        let mayor = 0
        const resultadosFinales = []
        resultados.forEach(candidato => {
            if(candidato.votos > mayor){

                mayor = candidato.votos

            }
        })

        resultados.forEach(candidato => {
            if(candidato.votos === mayor){
                resultadosFinales.push({id: candidato.id,  resultado: 1, votos: candidato.votos})
            } else {
                resultadosFinales.push({id: candidato.id, resultado: 0, votos: candidato.votos})
            }
        })

        return resultadosFinales
    }

    /** 
     * Cuenta las veces que se repite un valor en un arreglo
     * @param arreglo {number array}
     * @param valor {number}, valor al que se le contará la frecuencia en el arreglo
     * @return frecuencia {number}
     */
    obtenerFrecuencia(arreglo, valor) {
        let frecuencia = 0
        for (let i = 0; i < arreglo.length; i++) {
            if (arreglo[i] === valor) {
                frecuencia += 1
            }
        }
        return frecuencia
    }
}

module.exports = Votacion;