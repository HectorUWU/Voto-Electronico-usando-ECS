/* eslint-disable no-undef */
const ECS = require("../server/services/ECS.js");
const ecs = new ECS();
test("Fragmentar el secreto 21 con un umbral de 2 y 3 participantes nos debera dar 3 fragmentos", () => {
  expect(ecs.fragmentarSecreto(21, 2, 3).size).toBe(3);
});

test("desfragmentacion (8,243367175), (5,1328931405), (3,1804960533) es 40", () => {
  const fragmentos = new Map();
  fragmentos.set(6,32001701837);
  fragmentos.set(5,22556688226);
  fragmentos.set(8,55825405033);
  expect(ecs.desfragmentarSecreto(fragmentos)).toBe(41);
});

test("Evaluacion 4x^2 + 3x + 27 con x = 12 es 639", () => {
  const coeficientes = [27, 3, 4];
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
