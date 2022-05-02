import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ResponseError from "./responseError";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import io from "socket.io-client";
const theme = createTheme();
const moment = require("moment");

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        color: "grey.800",
        border: "1px solid",
        borderColor: "grey.300",
        p: 1,
        m: 1,
        borderRadius: 2,
        fontSize: "0.875rem",
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
}

export default function Main() {
  /**
   * Estado que contendra los objetos de todos los candidatos de la base de datos
   * @type {object}
   */
  const [infoCandidatos, setInfoCandidatos] = React.useState([]);
  /**
   * Estado que contendra el estado de la votacion
   * @type {string}
   */
  const [estadoVotacion, setEstadoVotacion] = React.useState("");
  /** Estado que contendra el estado de la votacion
   * @type {string}
   */
  const [nombreVotacion, setNombreVotacion] = React.useState("");
  /** Estado que contendra la fecha de inicio de la votacion
   * @type {string}
   */
  const [fechaInicioVotacion, setFechaInicioVotacion] = React.useState("");
  /** Estado que contendra la fecha de fin de la votacion
   * @type {string}
   */
  const [fechaFinVotacion, setFechaFinVotacion] = React.useState("");
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
   * 
   * 
   */
  const [socket, setSocket] = React.useState(null);
  /**
   * 
   * Funcion que recupera la informacion de los candidatos de la ultima votacion en caso de que este finalizada y el estado de la misma
   */
  React.useEffect(() => {
    fetch("https://vota-escom.herokuapp.com/api/verResultadosUltimaVotacion")
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        if (
          (response.estado === "activo") |
          (response.estado === "listoParaConteo")
        ) {
          setNombreVotacion(response.nombre);
          setEstadoVotacion(response.estado);
          setFechaInicioVotacion(
            moment(response.fechaInicio).utc().format("DD/MM/YYYY")
          );
          setFechaFinVotacion(
            moment(response.fechaFin).utc().format("DD/MM/YYYY")
          );
        } else if (response.estado === "inactivo") {
          setEstadoVotacion(response.estado);
        } else {
          setInfoCandidatos(response);
          setEstadoVotacion("finalizado");
        }
      });

  }, []);
  React.useEffect(() => {
    const socket = io("https://vota-escom.herokuapp.com");
    socket.emit('test msg', 'hola mundo---------------');
    setSocket(socket);
    
    return () => socket.close();
  }, [setSocket]);

  let votosTotales = 0;
  if (estadoVotacion === "finalizado") {
    infoCandidatos.forEach((candidato) => {
      votosTotales += candidato.numeroVotos;
    });
  }
  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <Typography variant="h2" component="h1" gutterBottom>{socket ? "Conectado" : "No conectado"}</Typography>
        <ResponseError error={error} showError={showError} />
        {/*Se mostraran los resultados de al ultima votacion si ya ha finalizado, 
          si esta activa se mostrara un mensaje para que vote, 
          si esta inactiva se mostrara un mensaje para que espere noticias,
          si ya termino su tiempo pero aun no se han contado, se mostrara un mensaje para qeu espere los resultados*/}
        {estadoVotacion === "activo" ? (
          <Typography
            align="center"
            component="h2"
            variant="h4"
            sx={{ flexGrow: 1, marginTop: 6 }}
          >
            La votacion {nombreVotacion} se encuentra activa en estos momentos,
            si aun no has votado, favor de hacerlo durante el periodo
            <br /> <br />
            {fechaInicioVotacion} - {fechaFinVotacion}
          </Typography>
        ) : estadoVotacion === "finalizado" ? (
          <Box sx={{ flexGrow: 1, marginTop: 6 }}>
            <Typography align="center" component="h2" variant="h4">
              Conoce los resultados de la ultima votacion
            </Typography>
            <Grid
              container
              spacing={{ xs: 4, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {infoCandidatos.map((candidato, i) => (
                <Grid item xs={4} sm={4} md={4} key={i}>
                  <Item>
                    <Card sx={{ maxWidth: 400, maxHeight: 500 }}>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        align="center"
                      >
                        {candidato.nombre}
                      </Typography>
                      <CardMedia
                        component="img"
                        height="300"
                        width="300"
                        image={candidato.foto}
                        alt={candidato.nombre}
                      />
                      <CardContent align="center">
                        {((100 / votosTotales) * candidato.numeroVotos).toFixed(
                          2
                        )}{" "}
                        %
                        <br />
                        {candidato.resultado === 1 ? "Electo" : "No electo"}
                      </CardContent>
                    </Card>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : estadoVotacion === "listoParaConteo" ? (
          <Typography
            align="center"
            component="h2"
            variant="h4"
            sx={{ flexGrow: 1, marginTop: 6 }}
          >
            La votacion: {nombreVotacion} con periodo de votacion
            <br /> <br />
            {fechaInicioVotacion} - {fechaFinVotacion}
            <br /> <br />
            ha concluido, favor de mantenerse atentos para la publicacion de
            resultados
          </Typography>
        ) : (
          <Typography
            align="center"
            component="h2"
            variant="h4"
            sx={{ flexGrow: 1, marginTop: 6 }}
          >
            No hay una votacion activa en estos momentos, espera noticias pronto
          </Typography>
        )}
      </Container>
    </ThemeProvider>
  );
}
