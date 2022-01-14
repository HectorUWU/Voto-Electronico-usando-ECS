const rref = require('rref')

const CAMPO_TAM = Math.pow(10, 2);

// u = umbral; p = no. de participantes
function fragmentarSecreto(secreto, u, p) {
    const coeficientes = []
    for (let i = 1; i < u; i++) {
        coeficientes.push(obtenerNumeroAleatorio(0, CAMPO_TAM))
    }
    coeficientes.push(secreto);
    const fragmentos = new Map()

    for (let i = 0; i < p; i++) {
        const x = obtenerNumeroAleatorio(1, CAMPO_TAM)

        fragmentos.set(x, evaluarPolinomio(x, coeficientes))
    }

    return fragmentos
}

function evaluarPolinomio(x, coeficientes) {
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

function desfragmentarSecreto(fragmentos) {
    const ecuaciones = []
    let i = 0;
    for (const [key, value] of fragmentos) {
        ecuaciones[i] = generarEcuacion(key, value, fragmentos.size)
        i++
    }
    return resolverSistemaEcuaciones(ecuaciones)
}

function generarEcuacion(x, y, grado) {
    const ecuacion = []
    for (let i = 0; i < grado; i++) {
        ecuacion.push(Math.pow(x, i))
    }
    ecuacion.push(y)
    return ecuacion
}

function resolverSistemaEcuaciones(ecuaciones) {
    const res = rref(ecuaciones)
    const x0 = res[0]
    return x0[res[0].length - 1]
}

const u = 5
const p = 10
const fragmentos = fragmentarSecreto(12345, u, p)
const muestra = new Map()
for (const [key, value] of fragmentos) {
    muestra.set(key, value)
    if (muestra.size === u)
        break
}
const desfragmentacion = desfragmentarSecreto(muestra)

console.log(fragmentos)
console.log(muestra)
console.log(desfragmentacion)