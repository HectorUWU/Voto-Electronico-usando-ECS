/* eslint-disable no-undef */
const ECS = require("../server/services/ECS.js");
const ecs = new ECS();
test("Fragmentar el secreto 21 con un umbral de 2 y 3 participantes nos debera dar 3 fragmentos", () => {
  expect(ecs.fragmentarSecreto(21, 2, 3).size).toBe(3);
});

test("desfragmentacion (1,1343433045), (5,2001450109), (3,1327094380) es 40", () => {
  const fragmentos = new Map();
  fragmentos.set(1, 1343433045);
  fragmentos.set(4,2114806357);
  fragmentos.set(7,1219016585);
  expect(ecs.desfragmentarSecreto(fragmentos)).toBe(40);
});

test("Evaluacion 4x^2 + 3x + 27 con x = 12 es 639", () => {
  const coeficientes = [4, 3, 27];
  expect(ecs.evaluarPolinomio(12, coeficientes)).toBe(639);
});

test("(5, 9) con umbral 3 (polinomio grado 2) es [1, 5, 25, 9]", () => {
  const resultado = [1, 5, 25, 9];
  expect(ecs.generarEcuacion(5, 9, 3)).toEqual(
    expect.arrayContaining(resultado)
  );
});

test("Matriz ejemplo (TT1.pptx) debe ser 21", () => {
  const matriz = [
    [1, 1, 1, 47],
    [1, 3, 9, 195],
    [1, 6, 36, 657],
  ];
  expect(ecs.resolverSistemaEcuaciones(matriz)).toBe(21);
});
