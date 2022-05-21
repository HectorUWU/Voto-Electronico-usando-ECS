/**
 * @fileoverview MesaElectoral, Clase que contiene los métodos de acciones realizadas por la Mesa Electoral
 * @version 1.0
 * @author Alondra Jacqueline Jacinto Sánchez
 * history
 * v.1.0 Se crean funciones validarParticipante, extraerVotos, descifrarVoto
 */

const fragmentoBD = require("../models/Fragmento"); // Módulo Fragmento, necesario para el acceso a la base de datos
const Rsa = require("./Rsa"); // Módulo RSA, necesario para descifrar el id de los fragmentos de la base de datos
const ECS = require("./ECS"); // Módulo ECS, necesario para la desfragmentación de los votos
const Votacion = require("./Votacion"); // Módulo Votación, necesario para el conteo de votos y generación de resultados
const candidatoBD = require("../models/Candidato"); // Módulo Candidato, necesario para almacenar en la base de datos
const votacionBD = require("../models/Votacion"); // Módulo votacion, necesario para conocer el umbral
const reader = require("xlsx"); // Módulo xlsx, necesario para leer archivos excel
const votanteBD = require("../models/Votante"); // Módulo votante, necesario para cambiar su estado académico

class MesaElectoral {
  /**
   * @constructor
   * @param umbral {numero}, umbral del ECS
   */
  constructor() {
    this.umbral = this.definirUmbral();
    this.participantesPresentes = [];
  }

  async definirUmbral() {
    this.umbral = await votacionBD.getUmbral().then((result) => {
      return result.umbral;
    });
  }

  /**
   * Función para validar la presencia de los participantes necesarios para iniciar el conteo de votos
   * @param llavePrivada {string}, Llave privada RSA del integrante de la mesa electoral
   * @param id  {string}, Id del integrante de la mesa electoral
   * @param contra  {string}, Contraseña del integrante de la mesa electoral
   */
  validarParticipante(llavePrivada, id, contra) {
    const rsa = new Rsa(llavePrivada);
    if (rsa.validarLlavePrivada(contra)) {
      this.participantesPresentes.push({
        id: id,
        llave: llavePrivada,
        contrasena: contra,
      });
    } else {
      return { mensaje: "La llave es invalida", estatus: 0 };
    }
    if (this.participantesPresentes.length === this.umbral) {
      return { mensaje: "Listo para iniciar", estatus: 4 };
    } else {
      return { mensaje: "Esperando a participantes", estatus: 1 };
    }
  }

  contarVotos() {
    return new Promise((resolve, reject) => {
      const idParticipantes = [];
      for (let i = 0; i < this.participantesPresentes.length; i++) {
        idParticipantes.push(this.participantesPresentes[i].id);
      }
      console.log(
        "-/-/-/-/-/-/-/-/-/-/-/-/*COMENZANDO CONTEO*/-/-/-/-/-/-/-/-/-/-/-/-"
      );
      this.extraerVotos(idParticipantes)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Función para extraer y manipular los votos almacenados en la base de datos
   * @param idParticipantes {string array}, Arreglo con los id de los participantes presentes
   */
  extraerVotos(idParticipantes) {
    return new Promise((resolve, reject) => {
      const fragmentos = new Map();
      const votosReales = [];
      fragmentoBD
        .obtenerFragmentos(idParticipantes)
        .then((result) => {
          // idFragmento, fragmento, idMesaElectoral
          result.forEach((fragmento) => {
            let contra = "";
            this.participantesPresentes.forEach((participante) => {
              if (participante.id === fragmento.idMesaElectoral) {
                contra = participante.contrasena;
              }
            });
            const idReal = this.descifrarVoto(
              fragmento.idFragmento,
              fragmento.idMesaElectoral,
              contra
            );
            if (idReal === null) {
              reject(new Error("Error al descifrar votos"));
            }
            if (fragmentos.has(idReal)) {
              const valor = fragmentos.get(idReal);
              valor.push(fragmento.fragmento);
              fragmentos.set(idReal, valor);
            } else {
              fragmentos.set(idReal, [fragmento.fragmento]);
            }
          });

          fragmentos.forEach((value) => {
            const voto = new Map();

            for (let i = 0; i < value.length; i++) {
              const coordenadas = value[i].split(",");
              voto.set(coordenadas[0], coordenadas[1]);
            }
            const desfragmentador = new ECS();
            const votoOriginal = desfragmentador.desfragmentarSecreto(voto);
            votosReales.push(votoOriginal);
            const conteo = new Votacion();
            const resultados = conteo.contarVotos(votosReales);
            resultados.forEach((resultadoFinal) => {
              candidatoBD
                .registrarVotos([
                  resultadoFinal.votos,
                  resultadoFinal.resultado,
                  resultadoFinal.id,
                ])
                .then((result) => {})
                .catch((err) => {
                  console.log("ERROR AL GUARDAR RESULTADOS " + err);
                  reject(err);
                });
            });
          });
          votacionBD.finalizarConteo();
          votanteBD.actualizarEstudiantes();
          resolve({ mensaje: "Conteo exitoso", estatus: 2 });
        })
        .catch((err) => {
          console.log("ERROR AL EXTRAER FRAGMENTOS " + err);
          reject(err);
        });
    });
  }

  /**
   * Función descifrar un voto con RSA
   * @param voto {string}, Texto cifrado
   * @param id {string}, Id del integrante de la mesa al que pertenece el fragmento
   * @param contra  {string}, Contraseña del integrante de la mesa electoral
   */
  descifrarVoto(voto, id, contra) {
    const participante = this.participantesPresentes.find(
      (participante) => participante.id === id
    ); // Se busca al objeto correspondiente para recuperar la llave privada del integrante de la mesa electoral
    const descifradorRsa = new Rsa(participante.llave);
    return descifradorRsa.descifrar(voto, contra);
  }

  verPresentes() {
    const participantes = [];
    this.participantesPresentes.forEach((participante) => {
      participantes.push(participante.id);
    });
    return participantes;
  }

  validarInscritos(archivo) {
    return new Promise((resolve, reject) => {
      const file = reader.readFile(archivo);
      const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
      const boletas = [];
      temp.forEach((res) => {
        if (res.boleta === undefined) {
          reject(
            new Error("Error, el archivo no cumple con el formato necesario")
          );
        }
        boletas.push(res.boleta);
      });
      votanteBD
        .actualizarEstadoAcademico(boletas)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = MesaElectoral;
