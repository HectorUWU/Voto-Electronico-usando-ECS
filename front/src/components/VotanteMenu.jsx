import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";
import ResponseError from "./responseError";
import Alert from "@mui/material/Alert";

const theme = createTheme();

export default function VotanteMenu() {
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
        console.log(response);
        setEstadoVotacion(response.estado);
      })
  }, []);
  let data = sessionStorage.getItem("votante");
  data = JSON.parse(data);
  if (data != null) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, backgroundColor: "#0099E6" }}>
              <HowToVoteIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Bienvenido {data.boleta}
            </Typography>
            {(estadoVotacion === "activo") |
            (estadoVotacion === "listoParaConteo") ? (
              data.estadoVoto === 0 ? (
                <Alert severity="info">
                  Aun no has ejercido tu voto, favor de hacerlo
                </Alert>
              ) : (
                <Alert severity="success">
                  Ya has ejercido tu voto, espera pronto los resultados
                </Alert>
              )
            ) : null}
            <ResponseError error={error} showError={showError} />
            <Button
              component={Link}
              to="/votante/verCandidatos"
              fullWidth
              variant="contained"
              disabled={
                (estadoVotacion === "activo") |
                (estadoVotacion === "listoParaConteo")
                  ? false
                  : true
              }
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
            >
              Ver candidatos
            </Button>
            <Button
              component={Link}
              to="/votante/votar"
              fullWidth
              variant="contained"
              disabled={
                data.estadoVoto === 0 &&
                data.estadoAcademico === 1 &&
                estadoVotacion === "activo"
                  ? false
                  : true
              }
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
            >
              Votar
            </Button>
            <Button
              component={Link}
              to=""
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
            >
              Cambiar contraseña
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
  } else {
    window.location.href = "/SingIn";
  }
}
