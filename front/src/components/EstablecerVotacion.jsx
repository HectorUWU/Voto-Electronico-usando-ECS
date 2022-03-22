import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ResponseError from "./responseError";
import Confirmacion from "./Confirmacion";
import DateAdapter from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { Link } from "react-router-dom";
import Stack from "@mui/material/Stack";

const theme = createTheme();
const moment = require('moment')

export default function SignUp() {
  const [error, setError] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [fechaInicio, setFechaInicio] = React.useState(moment().add(1,'days'));
  const [fechaFinal, setFechaFinal] = React.useState(moment().add(2,'days'));
  /**
   * Funcion que cambia el valor de fechaInicio
   * @param newValue {momentObject} 
   */
  const handleChangeFechaInicio = (newValue) => {
    setFechaInicio(newValue);
  };
  /**
   * Funcion que cambia el valor de fechaFin
   * @param newValue {momentObject} 
   */
  const handleChangeFechaFinal = (newValue) => {
    setFechaFinal(newValue);
  };
  /**
   * Funcion que envia la informacion de la votacion introducida en el formulario
   * @param event 
   */
  const handleSubmit = (event) => {
    let datasesion = sessionStorage.getItem("MesaElectoral");
    datasesion = JSON.parse(datasesion);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let datos = {
      nombre: data.get("nombreVotacion"),
      fechaInicio: moment(fechaInicio).format('YYYY-MM-DD'),
      fechaFin: moment(fechaFinal).format('YYYY-MM-DD'),
      participantes: data.get("participantes"),
      umbral: data.get("umbral")
    };
    let config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": datasesion.token
      },
      body: JSON.stringify(datos),
    };
    fetch("http://localhost:8000/api/registroVotacion", config)
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          setError(response.error);
          setShowError(true);
        } else {
          setOpen(true);
        }
      })
      .catch((error) => {
        setError(error);
        setShowError(true);
      });
  };
  let data = sessionStorage.getItem("MesaElectoral");
  data = JSON.parse(data);
  if (data != null) {
  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
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
          <Typography component="h1" variant="h5">
            Datos de la votacion
          </Typography>
          <ResponseError error={error} showError={showError} />  
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                  required
                  fullWidth  
                  name="nombreVotacion"
                  label="Nombre de la votacion"
                  id="nombreVotacion"
                />
              </Grid>
              <Grid item xs={12}>
              <DatePicker
                disablePast
                inputFormat="DD/MM/YYYY"
                label="Fecha de inicio"
                minDate={moment().add(1,'days')}
                value={fechaInicio}
                onChange={handleChangeFechaInicio}
                renderInput={(params) => <TextField required fullWidth {...params} />}
                />
              </Grid>
              <Grid item xs={12}>
              <DatePicker
                disablePast
                inputFormat="DD/MM/YYYY"
                label="Fecha de fin"
                minDate={moment().add(2,'days')}
                value={fechaFinal}
                onChange={handleChangeFechaFinal}
                renderInput={(params) => <TextField required fullWidth {...params} />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="participantes"
                  label="No. de participantes"
                  id="participantes"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="umbral"
                  label="Umbral"
                  id="umbral"
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              </Grid>
            </Grid>
            <Box
            sx={{
              marginTop: 5,
              marginBottom: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={2}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ backgroundColor: "#0099E6" }}
              >
                Registrar votacion
              </Button>
              <Button 
                variant='contained' 
                sx={{ backgroundColor: '#0099E6'}} 
                component={Link} 
                to="/mesa/menuPrincipal"> Regresar </Button>
            </Stack>
          </Box>
            
            <Confirmacion
              open={open}
              ruta={"/votante/menuPrincipal"}
              mensaje={
                "Datos de la votacion guardados"
              }
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </LocalizationProvider>
  );
  } else {
    window.location.href = "/mesa/menuPrincipal";
  }
}
