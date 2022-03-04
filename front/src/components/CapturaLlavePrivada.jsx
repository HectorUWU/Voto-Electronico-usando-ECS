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

  const handleChange = (event) => {
    console.log(event.target.files[0]);
    event.preventDefault();
    setFileName(event.target.files[0].name);
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
    fetch("http://localhost:8000/api/validarIntegrante", config)
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          setError(response.error);
          setShowError(true);
        } else {
          window.location.href = "/mesa/menuPrincipal";
        }
      });
  };

  let data = sessionStorage.getItem("MesaElectoral");
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
            <Avatar sx={{ m: 1, bgcolor: "#0099E6" }}>
              <HowToRegIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Comenzar conteo de votos
            </Typography>
            <ResponseError error={error} showError={showError} />
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <Item elevation={0}>{`Ingrese su llave privada`}</Item>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <label htmlFor="contained-button-file">
                  <Input
                    onChange={handleChange}
                    accept=".pem"
                    id="contained-button-file"
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
        </Container>
      </ThemeProvider>
    );
  } else {
    window.location.href = "/";
  }
}
