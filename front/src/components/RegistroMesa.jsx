import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ResponseError from "./responseError";
import Confirmacion from "./Confirmacion";
import { useParams } from "react-router-dom";
const theme = createTheme();

export default function SignUp() {
  const [error, setError] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { token, id } = useParams();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const correo = data.get("correo").split("@");
    if (correo[1] === "alumno.ipn.mx") {
      const boleta = data.get("boleta");
      if(boleta.length === 10 && boleta.substring(0, 2) === "20"){
    let datos = {
      boleta: data.get("boleta"),
      idMesaElectoral: "ME" + data.get("boleta") ,
      correo: data.get("correo"),
      contrasena: data.get("contrasena"),
      repetir: data.get("confirmarContrasena"),
    };
    let config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    };
    fetch("https://vota-escom.herokuapp.com/api/registroMesa/" + token + "/" + id, config)
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          setError(response.error);
          setShowError(true);
        } else {
          setOpen(true);
        }
      })
    }else{
      setError("Ingresa una boleta valida");
      setShowError(true);
    }
  } else {
    setError("Ingresa correo institucional");
    setShowError(true);
  }
  };
  let data = sessionStorage.getItem("votante");
  data = JSON.parse(data);
  if (data != null) {
    window.location.href = "/votante/menuPrincipal";
  }
  data = sessionStorage.getItem("MesaElectoral");
  data = JSON.parse(data);
  if (data != null) {
    window.location.href = "/mesa/menuPrincipal";
  }
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registro
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
                  id="boleta"
                  label="Boleta"
                  name="boleta"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="correo"
                  label="Correo"
                  name="correo"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="contrasena"
                  label="Contraseña"
                  type="password"
                  id="contrasena"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="confirmarContrasena"
                  label="Repite tu contraseña"
                  type="password"
                  id="confirmarContrasena"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
            >
              Registrar
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/SingIn" variant="body2">
                  ¿Ya tienes una cuenta? Inicia Sesion
                </Link>
              </Grid>
            </Grid>
            <Confirmacion
              open={open}
              ruta={"/SingIn"}
              mensaje={
                "Registro exitoso. Se ha enviado un correo de confirmacion"
              }
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
