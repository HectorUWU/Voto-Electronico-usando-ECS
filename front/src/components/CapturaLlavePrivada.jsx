import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ResponseError from "./responseError";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Link } from "react-router-dom";

let miWebSocket = null;

const Input = styled("input")({
  display: "none",
});

const Item = styled(Paper)(({ theme }) => ({
  textAlign: "center",
  height: 50,
  lineHeight: "50px",
}));

const theme = createTheme();

export default function CapturaLlavePrivada() {
  const [fileName, setFileName] = React.useState("Abrir...");
  const [error, setError] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  let [listaMesa, setInfoMesa] = React.useState([]);
  let [conteoEnCurso, setConteoEnCurso] = React.useState(true);

  const [severity, setSeverity] = React.useState("info");
  const [tablamsg, setTablamsg] =
    React.useState(`En espera del resto de miembros de la mesa electoral para
  comenzar el conteo. Se requieren al menos t miembros para
  continuar`);

  const handleChange = (event) => {
    console.log(event.target.files[0]);
    event.preventDefault();
    setFileName(
      event.target.files[0] != null ? event.target.files[0].name : "Abrir..."
    );
  };

  const handleSubmit = (event) => {
    let data = sessionStorage.getItem("MesaElectoral");
    data = JSON.parse(data);
    event.preventDefault();
    const formulario = new FormData(event.currentTarget);
    let datos = {
      llave: formulario.get("llave"),
      contrasena: formulario.get("contrasena"),
    };
    let config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": data.token,
      },
      body: JSON.stringify(datos),
    };
    fetch("https://vota-escom.herokuapp.com/api/validarIntegrante", config)
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          setError(response.error);
          setShowError(true);
        } else {
          document.getElementById("formContainer").style.display = "none";
          document.getElementById("tablaEspera").style.display = "block";
          miWebSocket = new WebSocket("ws://localhost:8080");

          miWebSocket.onopen = function (evt) {
            const file = document.getElementById("llave").files[0];
            const reader = new FileReader();
            let rawData = new ArrayBuffer();
            reader.loadend = function () {};

            reader.onload = function (evt) {
              rawData = evt.target.result;
              const enc = new TextDecoder("utf-8");
              const llave = enc.decode(rawData);
              miWebSocket.send(
                JSON.stringify({
                  llave: llave,
                  id: data.idMesaElectoral,
                  contrasena: formulario.get("contrasena"),
                })
              );
            };
            reader.readAsArrayBuffer(file);
          };

          miWebSocket.onclose = function (evt) {
            console.log(conteoEnCurso)
            if (conteoEnCurso) {
              document.getElementById("formContainer").style.display = "block";
              document.getElementById("tablaEspera").style.display = "none";
              setError("Ocurrió un error al validar la llave privada");
              setShowError(true);
            }
            // window.location.href = "/mesa/menuPrincipal";
          };

          miWebSocket.onmessage = function (event) {
            const jsondata = JSON.parse(event.data);
            if (jsondata.estatus !== undefined) {
              const listaAux = [];
              listaMesa.forEach((mesa) => {
                if (jsondata.id === mesa.idMesaElectoral) {
                  listaAux.push({
                    idMesaElectoral: mesa.idMesaElectoral,
                    estado: jsondata.estatus,
                  });
                } else {
                  listaAux.push({
                    idMesaElectoral: mesa.idMesaElectoral,
                    estado: mesa.estado,
                  });
                }
              });
              listaMesa = listaAux;
              setInfoMesa(listaMesa);
            } else if (jsondata.msg === "Participante ya registrado") {
              // Mostrar alerta de que ya se habia registrado
            } else if (jsondata.error !== undefined) {
              conteoEnCurso = false;
              setSeverity("error");
              setTablamsg(
                "Ocurrió un error en el conteo de votos, por favor refresque la página e ingrese sus credenciales nuevamente"
              );
              miWebSocket.close();
            } else {
              conteoEnCurso = false;
              setConteoEnCurso(conteoEnCurso);
              setSeverity("success");
              setTablamsg(
                "Participantes necesarios presentes. Pulse el botón Continuar para ver los resultados del conteo de votos"
              );
              //miWebSocket.close();
            }
          };
        }
      });
  };

  let data = sessionStorage.getItem("MesaElectoral");
  data = JSON.parse(data);

  React.useEffect(() => {
    fetch("/api/listaMesa")
      .then((response) => {
        return response.json();
      })
      .then((candidatos) => {
        candidatos.forEach((candidato) => {
          candidato.estado = 0;
        });
        setInfoMesa(candidatos);
      })
      .catch((error) => {
        setError(error);
        setShowError(true);
      });
  }, []);
  if (data != null) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="md">
          <CssBaseline />
          <div id="formContainer">
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "#0099E6" }}>
                <HowToRegIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Comenzar conteo de votos
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <ResponseError error={error} showError={showError} />
                <Item elevation={0}>{`Ingrese su llave privada`}</Item>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <label htmlFor="llave">
                    <Input
                      required
                      onChange={handleChange}
                      accept=".pem"
                      id="llave"
                      name="llave"
                      multiple
                      type="file"
                    />
                    <Button variant="contained" component="span">
                      {fileName}
                    </Button>
                  </label>
                </Box>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="contrasena"
                  label="Contraseña"
                  type="password"
                  id="contrasena"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, bgcolor: "#0099E6" }}
                >
                  Continuar
                </Button>
              </Box>
            </Box>
          </div>

          <div id="tablaEspera" style={{ display: "none" }}>
            <Box
              sx={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Alert severity={severity}>{tablamsg}</Alert>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Miembro</TableCell>
                      <TableCell align="center">Estatus</TableCell>
                    </TableRow>
                    {listaMesa.map((integrante, i) => (
                      <TableRow key={i}>
                        <TableCell align="center">
                          {integrante.idMesaElectoral}
                        </TableCell>
                        <TableCell align="center">
                          {integrante.estado === 1 ? (
                            <CheckCircleIcon></CheckCircleIcon>
                          ) : (
                            <CircularProgress></CircularProgress>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableHead>
                  <TableBody></TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="contained"
                disabled={conteoEnCurso}
                sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
                component={Link}
                to="/mesa/resultados"
              >
                Continuar
              </Button>
            </Box>
          </div>
        </Container>
      </ThemeProvider>
    );
  } else {
    window.location.href = "/";
  }
}
