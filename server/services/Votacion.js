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
    const resultados = [];
    for (const item of candidatos) {
      resultados.push({ id: item, votos: this.obtenerFrecuencia(votos, item) });
      // resultados.push(new Candidato(item, this.obtenerFrecuencia(votos, item)))
    }
    return this.decidirCandidatosElectos(resultados);
  }

  /**
   * Establece el estatus ganador para los candidatos electos
   * @param resultados {Candidato array}, arreglo de Candidatos con el id y conteo de votos
   * @return resultadosFinales {Candidato array}, arreglo de Candidatos con el id, conteo de votos y estatus (1 para electo, 0 para no electo)
   */
  decidirCandidatosElectos(resultados) {
    const candidatosElegidos = 8; // Es el numero de candidatos que deben elegirse en la votación
    const len = resultados.length;

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        if (resultados[j].votos < resultados[j + 1].votos) {
          const temp = resultados[j];
          resultados[j] = resultados[j + 1];
          resultados[j + 1] = temp;
        }
      }
    }

    const resultadosFinales = [];

    for (let i = 0; i < len; i++) {
      if (i < candidatosElegidos) {
        resultadosFinales.push({
          id: resultados[i].id,
          resultado: 1,
          votos: resultados[i].votos,
        });
      } else {
        resultadosFinales.push({
          id: resultados[i].id,
          resultado: 0,
          votos: resultados[i].votos,
        });
      }
    }

    return resultadosFinales;
  }

  /**
   * Cuenta las veces que se repite un valor en un arreglo
   * @param arreglo {number array}
   * @param valor {number}, valor al que se le contará la frecuencia en el arreglo
   * @return frecuencia {number}
   */
  obtenerFrecuencia(arreglo, valor) {
    let frecuencia = 0;
    for (let i = 0; i < arreglo.length; i++) {
      if (arreglo[i] === valor) {
        frecuencia += 1;
      }
    }
    return frecuencia;
  }
}

module.exports = Votacion;
