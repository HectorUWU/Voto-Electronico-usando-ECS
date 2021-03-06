/* eslint-disable no-undef */
import "regenerator-runtime/runtime";
const Votante = require("../server/services/Votante.js");
const votanteSinVotar = new Votante(0, 1);
test("Votar sin haber votado previamente y estado academico activo", () => {
  expect(votanteSinVotar.votar(1, 2, 3)).resolves.toBe({
    mensaje: "Voto correcto",
  });
});

const votanteConVotoPrevio = new Votante(1, 1);
test("Votar sin haber votado previamente y estado academico activo", () => {
  expect(votanteConVotoPrevio.votar(1, 2, 3)).rejects.toThrow(
    "Ya has ejercido tu voto"
  );
});

const votanteSinEstadoAcademico = new Votante(0, 0);
test("Votar sin haber votado previamente y estado academico activo", () => {
  expect(votanteSinEstadoAcademico.votar(1, 3, 2)).rejects.toThrow(
    "No estas inscrito y no puedes votar"
  );
});
