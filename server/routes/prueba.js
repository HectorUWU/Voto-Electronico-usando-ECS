const jwt = require('jsonwebtoken')

const token = jwt.sign({ idMesaElectoral: 1, contrasena: "we", rol:"MesaElectoral" },
"ASSDFSDSGDFGDB",
{ expiresIn: "5h" }
);

const verify = jwt.verify(token, "ASSDFSDSGDFGDB")
console.log(verify.rol)