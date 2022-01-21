/* eslint-disable no-undef */
const ECS = require('../server/services/ECS.js')

test('desfragmentacion (1,47), (3,195), (6,657) es 21', () => {
    const fragmentos = new Map()
    fragmentos.set(1, 47)
    fragmentos.set(3, 195)
    fragmentos.set(6, 657)
    expect(ECS.desfragmentarSecreto(fragmentos)).toBe(21)
})

test('Evaluacion 4x^2 + 3x + 27 con x = 12 es 639', () => {
    const coeficientes = [4, 3, 27]
    expect(ECS.evaluarPolinomio(12, coeficientes)).toBe(639)
})

test('(5, 9) con umbral 3 (polinomio grado 2) es [1, 5, 25, 9]', () => {
    const resultado = [1, 5, 25, 9]
    expect(ECS.generarEcuacion(5, 9, 3)).toEqual(expect.arrayContaining(resultado));
})

test('Matriz ejemplo (TT1.pptx) debe ser 21', () => {
    const matriz = [
        [1, 1, 1, 47],
        [1, 3, 9, 195],
        [1, 6, 36, 657]
    ]
    expect(ECS.resolverSistemaEcuaciones(matriz)).toBe(21)
})