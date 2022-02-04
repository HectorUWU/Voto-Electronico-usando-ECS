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
        return resultados
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