// const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,16}$/;
const v = require("./Votante");
const boleta = '2015021002'

console.log(v.verificarBoleta(boleta));
