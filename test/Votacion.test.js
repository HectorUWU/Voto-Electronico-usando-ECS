/* eslint-disable no-undef */
const Votacion = require("../server/services/Votacion");
const vota = new Votacion();

test("Conteo de votos debe ser ME1 = 2, ME2 = 1, ME3 = 1 y los 3 candidatos quedan electos", () => {
  const votos = ["ME1", "ME1", "ME2", "ME3"];
  expect(vota.contarVotos(votos)).toEqual(
    expect.arrayContaining([
      { id: "ME1", resultado: 1, votos: 2 },
      { id: "ME2", resultado: 1, votos: 1 },
      { id: "ME3", resultado: 1, votos: 1 },
    ])
  );
});

test("Conteo de frecuencia en arreglo debe ser 3", () => {
  const arreglo = ["a", "b", "c", "a", "c", "b", "c", "a", "b"];
  expect(vota.obtenerFrecuencia(arreglo, "a")).toBe(3);
});

test("Elección de los 8 candidatos con más votos obtenidos", () => {
  const candidatos = [];
  candidatos.push({ id: "ME1", votos: 20 });
  candidatos.push({ id: "ME2", votos: 30 });
  candidatos.push({ id: "ME3", votos: 3 });
  candidatos.push({ id: "ME4", votos: 40 });
  candidatos.push({ id: "ME5", votos: 32 });
  candidatos.push({ id: "ME6", votos: 1 });
  candidatos.push({ id: "ME7", votos: 90 });
  candidatos.push({ id: "ME8", votos: 75 });
  candidatos.push({ id: "ME9", votos: 11 });
  candidatos.push({ id: "ME10", votos: 27 });
  candidatos.push({ id: "ME11", votos: 93 });
  candidatos.push({ id: "ME12", votos: 7 });

  const resultados = [
    { id: "ME11", resultado: 1, votos: 93 },
    { id: "ME7", resultado: 1, votos: 90 },
    { id: "ME8", resultado: 1, votos: 75 },
    { id: "ME4", resultado: 1, votos: 40 },
    { id: "ME5", resultado: 1, votos: 32 },
    { id: "ME2", resultado: 1, votos: 30 },
    { id: "ME10", resultado: 1, votos: 27 },
    { id: "ME1", resultado: 1, votos: 20 },
    { id: "ME9", resultado: 0, votos: 11 },
    { id: "ME12", resultado: 0, votos: 7 },
    { id: "ME3", resultado: 0, votos: 3 },
    { id: "ME6", resultado: 0, votos: 1 },
  ];

  expect(vota.decidirCandidatosElectos(candidatos)).toEqual(
    expect.arrayContaining(resultados)
  );
});
