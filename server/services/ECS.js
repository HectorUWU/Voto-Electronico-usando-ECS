/**
 * @fileoverview ECS, Clase que contiene los métodos del esquema de compartición de secretos de Shamir
 * @version 1.0
 * @author Alondra Jacqueline Jacinto Sánchez
 * history
 * v.1.0 Se crean funciones fragmentarSecreto, evaluarPolinomio, obtenerNumeroAleatorio, desfragmentarSecreto, generarEcuacion y resolverSistemaEcuaciones
 */
const rref = require("rref"); // Módulo rref, necesario para resolver el sistema de ecuaciones
const math = require("mathjs"); // Módulo mathjs, necesario para las operaciones matemáticas modulo
const CAMPO_TAM = Math.pow(2, 31) - 1; // Constante que define el tamaño del plano

class ECS {
  /** @constructor */
  // constructor() {}
  /**
   * Fragmenta un secreto utilizando ECS de Shamir
   * @param secreto {number}
   * @param u {number}, umbral
   * @param p {number}, No. de participantes
   * @return fragmentos {map}
   */
  fragmentarSecreto(secreto, u, p) {
    const coeficientes = [];

    for (let i = 1; i < u; i++) {
      coeficientes.push(obtenerNumeroAleatorio(0, CAMPO_TAM));
    }
    coeficientes.push(secreto);
    const fragmentos = new Map();

    for (let i = 0; i < p; i++) {
      fragmentos.set(i + 1, this.evaluarPolinomio(i + 1, coeficientes));
    }

    return fragmentos;
  }

  /**
   * Evalua un polinomio en x
   * @param x {number}, valor de x a evaluar
   * @param coeficientes {number array}, arreglo con los coeficientes del polinomio
   * @return evaluacion {number}
   */
  evaluarPolinomio(x, coeficientes) {
    let evaluacion = 0;
    let j = 0;
    for (let i = coeficientes.length - 1; i >= 0; i--) {
      evaluacion += Math.pow(x, i) * coeficientes[j];
      j++;
    }

    return math.mod(evaluacion, CAMPO_TAM);
  }

  /**
   * Recupera un secreto con base en los fragmentos utilizando ECS de Shamir
   * @param fragmentos {map}
   * @return ECS.resolverSistemaEcuaciones {number}, secreto desfragmentado
   */
  desfragmentarSecreto(fragmentos) {
    const ecuaciones = [];
    let i = 0;
    for (const [key, value] of fragmentos) {
      ecuaciones[i] = this.generarEcuacion(key, value, fragmentos.size);
      i++;
    }

    return math.mod(this.resolverSistemaEcuaciones(ecuaciones), CAMPO_TAM);
  }

  /**
   * Genera una ecuación única para un punto dado
   * @param x {number}, coordenada en x
   * @param y {number}, coordenada en y
   * @param u {number}, umbral del ECS de Shamir
   * @return ecuacion {number array}
   */
  generarEcuacion(x, y, u) {
    const ecuacion = [];
    for (let i = 0; i < u; i++) {
      ecuacion.push(Math.pow(x, i));
    }
    ecuacion.push(y);
    return ecuacion;
  }

  /**
   * Utiliza el módulo rref para resolver un sistema de ecuaciones mediante eliminación Gaussiana
   * @param ecuaciones {number matrix}, Matriz con los coeficientes del sistema de ecuaciones
   * @return x0[res[0].length - 1] {number}, Valor de x0
   */
  resolverSistemaEcuaciones(ecuaciones) {
    const res = rref(ecuaciones);
    const x0 = res[0];
    return x0[res[0].length - 1];
  }
}

function obtenerNumeroAleatorio(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = ECS;
