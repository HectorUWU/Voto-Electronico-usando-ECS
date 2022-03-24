/* eslint-disable no-undef */
const Votacion = require('../server/services/Votacion')
const vota = new Votacion()

test('Conteo de votos debe ser ME1 = 2, ME2 = 1, ME3 = 1', () => {
    const votos = ['ME1', 'ME1', 'ME2', 'ME3']
    expect(vota.contarVotos(votos)).toEqual(expect.arrayContaining([{ id: 'ME1', resultado: 1, votos: 2 }, { id: 'ME2', resultado: 0, votos: 1 }, { id: 'ME3', resultado: 0, votos: 1 }]))
})

test('Conteo de frecuencia en arreglo debe ser 3', () => {
    const arreglo = ['a', 'b', 'c', 'a', 'c', 'b', 'c', 'a', 'b']
    expect(vota.obtenerFrecuencia(arreglo, 'a')).toBe(3)
})