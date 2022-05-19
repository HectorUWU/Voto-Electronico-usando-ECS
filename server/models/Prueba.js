const c = require('./Candidato');

c.obtenerElectos().then((electos) => {
    electos.forEach((e) => {
        console.log(e.nombre);
    });
});
