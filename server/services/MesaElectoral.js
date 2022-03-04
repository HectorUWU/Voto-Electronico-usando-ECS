/** 
 * @fileoverview MesaElectoral, Clase que contiene los métodos de acciones realizadas por la Mesa Electoral
 * @version 1.0
 * @author Alondra Jacqueline Jacinto Sánchez
 * history 
 * v.1.0 Se crean funciones validarParticipante, extraerVotos, descifrarVoto
 */

const fragmentoBD = require('../models/Fragmento') // Módulo Fragmento, necesario para el acceso a la base de datos
const Rsa = require('./Rsa') // Módulo RSA, necesario para descifrar el id de los fragmentos de la base de datos
const ECS = require('./ECS') // Módulo ECS, necesario para la desfragmentación de los votos
const Votacion = require('./Votacion') // Módulo Votación, necesario para el conteo de votos y generación de resultados
const candidatoBD = require('../models/Candidato') // Módulo Candidato, necesario para almacenar en la base de datos

class MesaElectoral {
    /**
     * @constructor
     * @param umbral {numero}, umbral del ECS
     */
    constructor(umbral) {
        this.umbral = umbral;
        this.participantesPresentes = []
    }

    /**
     * Función para validar la presencia de los participantes necesarios para iniciar el conteo de votos
     * @param llavePrivada {string}, Llave privada RSA del integrante de la mesa electoral
     * @param id  {string}, Id del integrante de la mesa electoral
     * @param contra  {string}, Contraseña del integrante de la mesa electoral
     */
    validarParticipante(llavePrivada, id, contra) {
        // if (this.validarLLave(llavePrivada)) {
        this.participantesPresentes.push({ id: id, llave: llavePrivada })
            //  }
        if (this.participantesPresentes.length === this.umbral) {
            const idParticipantes = []
            for (let i = 0; i < this.participantesPresentes.length; i++) {
                idParticipantes.push(this.participantesPresentes[i].id)
            }
            return this.extraerVotos(idParticipantes, contra)
        }
        return { mensaje: "Esperando a participantes" }
    }

    /**
     * Función para extraer y manipular los votos almacenados en la base de datos
     * @param idParticipantes {string array}, Arreglo con los id de los participantes presentes
     * @param contra  {string}, Contraseña del integrante de la mesa electoral
     */
    extraerVotos(idParticipantes, contra) {
        const fragmentos = new Map()
        const votosReales = []
        fragmentoBD.obtenerFragmentos(idParticipantes).then(result => {
            // idFragmento, fragmento, idMesaElectoral
            result.forEach(fragmento => {
                const idReal = this.descifrarVoto(fragmento.idFragmento, fragmento.idMesaElectoral, contra)
                if (fragmentos.has(idReal)) {
                    const valor = fragmentos.get(idReal)
                    valor.push(fragmento.fragmento)
                    fragmentos.set(idReal, valor)
                } else {
                    fragmentos.set(idReal, [fragmento.fragmento])
                }
            });

            fragmentos.forEach(value => {
                const voto = new Map()

                for (let i = 0; i < value.length; i++) {
                    const coordenadas = value[i].split(',')
                    voto.set(coordenadas[0], coordenadas[1])
                }
                const desfragmentador = new ECS()
                const votoOriginal = desfragmentador.desfragmentarSecreto(voto)
                votosReales.push(votoOriginal)
                const conteo = new Votacion()
                const resultados = conteo.contarVotos(votosReales)
                resultados.forEach(resultadoFinal => {
                    candidatoBD.registrarVotos([resultadoFinal.votos, resultadoFinal.resultado, resultadoFinal.id]).then().catch((err) => {
                        console.log(err)
                        return { error: 'No se pudo guardar el resultado' }
                    })
                });
            });
        }).catch(err => {
            console.log(err)
            return { error: 'No se pudieron extraer los fragmentos de la base de datos' }
        })
        return { mensaje: 'Conteo exitoso' }
    }

    /**
     * Función descifrar un voto con RSA
     * @param voto {string}, Texto cifrado
     * @param id {string}, Id del integrante de la mesa al que pertenece el fragmento
     * @param contra  {string}, Contraseña del integrante de la mesa electoral
     */
    descifrarVoto(voto, id, contra) {
        const participante = this.participantesPresentes.find(participante => participante.id === id); // Se busca al objeto correspondiente para recuperar la llave privada del integrante de la mesa electoral
        const descifradorRsa = new Rsa(participante.llave)
        return descifradorRsa.descifrar(voto, contra)
    }

}

module.exports = MesaElectoral;

const llave3 = `-----BEGIN ENCRYPTED PRIVATE KEY-----
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
-----END ENCRYPTED PRIVATE KEY-----`

const llave1 = `-----BEGIN ENCRYPTED PRIVATE KEY-----
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
-----END ENCRYPTED PRIVATE KEY-----`

const llave2 = `-----BEGIN ENCRYPTED PRIVATE KEY-----
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
-----END ENCRYPTED PRIVATE KEY-----`

const mesa = new MesaElectoral(3)
mesa.validarParticipante(llave1, 'ME1', 'contra')
mesa.validarParticipante(llave2, 'ME2', 'contra')
mesa.validarParticipante(llave3, 'ME3', 'contra')