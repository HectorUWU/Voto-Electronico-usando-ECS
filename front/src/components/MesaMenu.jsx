import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import ResponseError from "./responseError";
import InicioVotacion from "./ConfirmacionInicioVotacion";

const theme = createTheme();

export default function MesaMenu() {
  /**
   * Estado que contendra los objetos de todos los candidatos de la base de datos
   * @type {object}
   */
  const [estadoVotacion, setEstadoVotacion] = React.useState("");
  /**
   * Estado usado paraguardar el error que se pudiera dar
   * @type {string}
   */
  const [error, setError] = React.useState("");
  /**
   * Estado usado para mostrar el error, en caso de que lo hubiera
   * @type {boolean}
   */
  const [showError, setShowError] = React.useState(false);
  /**
   * Funcion que recupera el estado de la ultima votacion
   */
  React.useEffect(() => {
    fetch("https://vota-escom.herokuapp.com/api/verEstadoUltimaVotacion")
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setEstadoVotacion(response.estado);
      });
  }, []);
  let data = sessionStorage.getItem("MesaElectoral");
  data = JSON.parse(data);
  console.log(estadoVotacion)
  if (data != null) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <ResponseError error={error} showError={showError} />
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <SupervisorAccountIcon />
            </Avatar>
            <Typography component="h1" variant="h5" align="center">
              Bienvenido miembro de la mesa electoral
            </Typography>
            <Button
              component={Link}
              to="/mesa/registrarCandidato"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
              disabled={
                (estadoVotacion === "preparacion") |
                (estadoVotacion === "listoParaIniciar")
                  ? false
                  : true
              }
            >
              Registrar candidatos
            </Button>
            <Button
              component={Link}
              to="/mesa/establecerVotacion"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
              disabled={estadoVotacion === "finalizado" ? false : true}
            >
              Establecer votacion
            </Button>
            <Button
              component={Link}
              to="/mesa/recuperarVotos"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
              disabled={estadoVotacion === "listoParaConteo" ? false : true}
            >
              Realizar conteo de votos
            </Button>
            <InicioVotacion estadoVotacion={estadoVotacion} />
            <Button
              component={Link}
              to="#"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
              disabled={
                (estadoVotacion === "listoParaConteo") |
                (estadoVotacion === "activo")
                  ? true
                  : false
              }
            >
              Cambiar contraseña
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
  } else {
    window.location.href = "/";
  }
}
