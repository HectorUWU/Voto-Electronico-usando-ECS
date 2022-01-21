/** 
 * @fileoverview ECS, Clase que contiene los métodos del esquema de compartición de secretos de Shamir
 * @version 1.0
 * @author Alondra Jacqueline Jacinto Sánchez
 * history 
 * v.1.0 Se crean funciones fragmentarSecreto, evaluarPolinomio, obtenerNumeroAleatorio, desfragmentarSecreto, generarEcuacion y resolverSistemaEcuaciones
 */
const rref = require("rref"); // Módulo rref, necesario para resolver el sistema de ecuaciones 

const CAMPO_TAM = Math.pow(10, 2); // Constante que define el tamaño del plano
/** @constructor */
const ECS = function() {}


/** 
 * Fragmenta un secreto utilizando ECS de Shamir
 * @param secreto {number} 
 * @param u {number}, umbral
 * @param p {number}, No. de participantes
 * @return fragmentos {map}
 */
ECS.fragmentarSecreto = function(secreto, u, p) {
    const coeficientes = []
    for (let i = 1; i < u; i++) {
        coeficientes.push(obtenerNumeroAleatorio(0, CAMPO_TAM))
    }
    coeficientes.push(secreto);
    const fragmentos = new Map()

    for (let i = 0; i < p; i++) {
        const x = obtenerNumeroAleatorio(1, CAMPO_TAM)

        fragmentos.set(x, ECS.evaluarPolinomio(x, coeficientes))
    }

    return fragmentos
}

/** 
 * Evalua un polinomio en x
 * @param x {number}, valor de x a evaluar 
 * @param coeficientes {number array}, arreglo con los coeficientes del polinomio
 * @return evaluacion {number}
 */
ECS.evaluarPolinomio = function(x, coeficientes) {
    let evaluacion = 0
    let j = 0
    for (let i = coeficientes.length - 1; i >= 0; i--) {
        evaluacion += Math.pow(x, i) * coeficientes[j]
        j++
    }

    return evaluacion
}

function obtenerNumeroAleatorio(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 
 * Recupera un secreto con base en los fragmentos utilizando ECS de Shamir
 * @param fragmentos {map}
 * @return ECS.resolverSistemaEcuaciones {number}, secreto desfragmentado
 */
ECS.desfragmentarSecreto = function(fragmentos) {
    const ecuaciones = []
    let i = 0;
    for (const [key, value] of fragmentos) {
        ecuaciones[i] = ECS.generarEcuacion(key, value, fragmentos.size)
        i++
    }
    return ECS.resolverSistemaEcuaciones(ecuaciones)
}

/** 
 * Genera una ecuación única para un punto dado
 * @param x {number}, coordenada en x 
 * @param y {number}, coordenada en y
 * @param u {number}, umbral del ECS de Shamir
 * @return ecuacion {number array}
 */
ECS.generarEcuacion = function(x, y, u) {
    const ecuacion = []
    for (let i = 0; i < u; i++) {
        ecuacion.push(Math.pow(x, i))
    }
    ecuacion.push(y)
    return ecuacion
}

/** 
 * Utiliza el módulo rref para resolver un sistema de ecuaciones mediante eliminación Gaussiana
 * @param ecuaciones {number matrix}, Matriz con los coeficientes del sistema de ecuaciones
 * @return x0[res[0].length - 1] {number}, Valor de x0
 */
ECS.resolverSistemaEcuaciones = function(ecuaciones) {
    const res = rref(ecuaciones)
    const x0 = res[0]
    return x0[res[0].length - 1]
}

module.exports = ECS;