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
     */
    validarParticipante(llavePrivada, id) {
        // if (this.validarLLave(llavePrivada)) {
        this.participantesPresentes.push({ id: id, llave: llavePrivada })
            //  }
        if (this.participantesPresentes.length === this.umbral) {
            const idParticipantes = []
            for (let i = 0; i < this.participantesPresentes.length; i++) {
                idParticipantes.push(this.participantesPresentes[i].id)
            }
            return this.extraerVotos(idParticipantes)
        }
        return { mensaje: "Esperando a participantes" }
    }

    /**
     * Función para extraer y manipular los votos almacenados en la base de datos
     * @param idParticipantes {string array}, Arreglo con los id de los participantes presentes
     */
    extraerVotos(idParticipantes) {
        const fragmentos = new Map()
        const votosReales = []
        fragmentoBD.obtenerFragmentos(idParticipantes).then(result => {
            // idFragmento, fragmento, idMesaElectoral
            result.forEach(fragmento => {
                const idReal = this.descifrarVoto(fragmento.idFragmento, fragmento.idMesaElectoral)
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
                    candidatoBD.registrarVotos([resultadoFinal.votos, resultadoFinal.id]).then().catch((err) => {
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
     */
    descifrarVoto(voto, id) {
        const participante = this.participantesPresentes.find(participante => participante.id === id); // Se busca al objeto correspondiente para recuperar la llave privada del integrante de la mesa electoral
        const descifradorRsa = new Rsa(participante.llave)
        return descifradorRsa.descifrar(voto, 'contra')
    }

}

module.exports = MesaElectoral;