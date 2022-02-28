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
const theme = createTheme();

export default function SignIn() {
  const [error, setError] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let datos = {
      id: data.get("id"),
      contrasena: data.get("contrasena"),
    };
    let config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    };
    fetch("http://localhost:8000/api/login", config)
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          setError(response.error);
          setShowError(true);
        } else {
          console.log(response);
          if (response.rol === "Votante") {
            sessionStorage.setItem("votante", JSON.stringify(response));
            window.location.href = "/votante/menuPrincipal";
          } else if (response.rol === "MesaElectoral") {
            sessionStorage.setItem("MesaElectoral", JSON.stringify(response));
            window.location.href = "/mesa/menuPrincipal";
          }
        }
      });
  };
  let data = sessionStorage.getItem("votante");
  data = JSON.parse(data);
  if(data != null) {
    window.location.href = "/votante/menuPrincipal";
  }
  data= sessionStorage.getItem("MesaElectoral");
  data = JSON.parse(data);
  if(data != null) {
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
            Iniciar Sesion
          </Typography>
          <ResponseError error={error} showError={showError} />
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="id"
              label="Boleta"
              name="id"
              autoComplete="id"
              autoFocus
            />
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
              sx={{ mt: 3, mb: 2 }}
            >
              Iniciar Sesion
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Olvidaste tu contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/registro" variant="body2">
                  {"No tienes cuenta? Registrate"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
