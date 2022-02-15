/**
 * @fileoverview Votante, clase que contiene los metodos del votante
 * @version 1.0
 * @author Kevin Uriel Malvaez Landeros
 * history
 * v.1.0 constructor y función votar
 */
const ECS = require("./ECS.js");
const Rsa = require("./Rsa.js");
const ME = require("../Models/MesaElectoral.js");
const F = require("../Models/Fragmento.js");

class Votante {
  constructor(EstadoVoto, EstadoAcademico) {
    /**
     * Propiedad que indica el estado del voto del votante
     * @type {boolean}
     */
    this.EstadoVoto = EstadoVoto;
    /**
     * Propiedad que indica el estado academico del votante
     * @type {boolean}
     */
    this.EstadoAcademico = EstadoAcademico;
  }

  /**
   * Fragmenta el voto
   * @param eleccion {number}, numero de eleccion del voto
   * @param u {number}, umbral
   * @param p {number}, No. de participantes
   * @return {promise}, resultado de la promesa
   */
  votar(eleccion, u, p) {
    return new Promise((resolve, reject) => {
      if (this.EstadoAcademico) {
        if (this.EstadoVoto) {
          reject(new Error('Ya has ejercido tu voto'))
        } else {
          const ecs = new ECS();
          // Obtener Id de voto
          const Id =
            String.fromCharCode(Math.floor(Math.random() * 26) + 97) +
            Math.random().toString(16).slice(2) +
            Date.now().toString(16).slice(4);
          const secretos = ecs.fragmentarSecreto(eleccion, u, p);
          const fragmentos = [];
          // obtener llave publica y Id de todos los integrantes de la mesa electoral que participen en la votación
          ME.obtenerLLavesPublicas()
            .then((resultados) => {
              let i = 0;
              for (const [llave, valor] of secretos) {
                // obtener llavepublica del integrante i de la mesa MesaElectoral
                const r = new Rsa(resultados[i].clavePublica);
                const fragmento = [
                  r.cifrar(Id), // Id cifrado con RSA
                  llave.toString() + "," + valor.toString(), // fragmento del ECS
                  resultados[i].idMesaElectoral,
                ]; // Id del integrante de la mesa electoral
                fragmentos.push(fragmento);
                i++;
              }
              F.guardarFragmentos(fragmentos).then((result) => {
                resolve({ mensaje: "Voto correcto" });
              });
            })
            .catch((err) => {
              reject(err);
            });
        }
      } else {
        reject(new Error('No estas inscrito y no puedes votar'))
      }
    });
  }
}

module.exports = Votante;
