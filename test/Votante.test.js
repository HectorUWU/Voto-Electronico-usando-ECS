/* eslint-disable no-undef */
const Votante = require('../server/services/Votante.js')

const votanteSinVotar = new Votante(false, true)
test('Votar sin haber votado previamente y estado academico activo', () => {
    expect(votanteSinVotar.votar(2,3,2)).resolves.toBe({mensaje: "Voto correcto"})
})

const votanteConVotoPrevio = new Votante(true, true)
test('Votar sin haber votado previamente y estado academico activo', () => {
    expect(votanteConVotoPrevio.votar(2,3,2)).rejects.toMatch("Ya has ejercido tu voto")
})

const votanteSinEstadoAcademico = new Votante(false, false)
test('Votar sin haber votado previamente y estado academico activo', () => {
    expect(votanteSinEstadoAcademico.votar(2,3,2)).rejects.toMatch("No estas inscrito y no puedes votar")
})