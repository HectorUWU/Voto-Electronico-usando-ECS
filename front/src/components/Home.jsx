import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ResponseError from "./responseError";
import Grid from '@mui/material/Grid';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
const theme = createTheme();

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
   const [infoCandidatos, setInfoCandidatos] = React.useState([])
     /**
   * Estado que contendra los objetos de todos los candidatos de la base de datos
   * @type {object}
   */
      const [estadoVotacion, setEstadoVotacion] = React.useState('')
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
   * Funcion que recupera la informacion de los candidatos de la ultima votacion y el estado de la misma
   */
  React.useEffect(() => {
    fetch('/api/verResultadosUltimaVotacion')
      .then((response) => {
        return response.json()
      })
      .then((response) => {
        console.log(response)
        if(response.resultado===false){
          setEstadoVotacion('inactivo') 
        } else if(response.resultado===true){
          setEstadoVotacion('activo') 
        } else{
          setInfoCandidatos(response)
          setEstadoVotacion('finalizado')
        }
          
      }).catch((error) => {
        setError(error);
        setShowError(true);
      })
  }, [])

  let votosTotales = 0;
  if(estadoVotacion==='finalizado'){
    infoCandidatos.forEach((candidato) => {
      votosTotales += candidato.numeroVotos;
    });
  }
  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <ResponseError error={error} showError={showError} />
          {/*Se mostraran los resultados de al ultima votacion si ya ha finalizado, si esta activa se mostrara un mensaje para que vote, si esta inactiva se mostrara un mensaje para que espere noticias*/}
          {estadoVotacion==='activo'?
          <Typography align="center" component="h2" variant="h4" sx={{flexGrow: 1, marginTop: 6}}>
          Hay una votacion activa en estos momentos, si aun no has votado, favor de hacerlo
          </Typography>
          :estadoVotacion==='finalizado'?
          <Box sx={{flexGrow: 1, marginTop: 6}}>
          <Typography align="center" component="h2" variant="h4">
          Conoce los resultados de la ultima votacion
          </Typography>
            <Grid container spacing={{ xs: 4, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
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
                  {((100 / votosTotales) * candidato.numeroVotos).toFixed(2)} %
                  <br />
                  {candidato.resultado === 1 ? "Electo": "No electo"}
                  </CardContent>
                </Card>
              </Item>
              </Grid>
            ))}
            </Grid>
          </Box>
          :<Typography align="center" component="h2" variant="h4" sx={{flexGrow: 1, marginTop: 6}}>
          No hay una votacion activa en estos momentos, espera noticias pronto
          </Typography>
          }
      </Container>
    </ThemeProvider>
  );
}
