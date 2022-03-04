import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SecurityIcon from "@mui/icons-material/Security";
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
  const [mensaje, setMensaje] = React.useState("WTF");
  const Verificar = (event) => {
    event.preventDefault();
    console.log(token);
    fetch("http://localhost:8000/api/verificar/" + token + "/" + id, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then((response) => response.json())
        .then((response) => {
      if (response.error) {
        setError(response.error);
        setShowError(true);
      } else {
        setMensaje(response.mensaje);
        setOpen(true);
      }
    });
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
            <SecurityIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Verificar correo
          </Typography>
          <ResponseError error={error} showError={showError} />
          <Button
            fullWidth
            variant="contained"
            onClick={Verificar}
            sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
          >
            Verificar
          </Button>
          <Confirmacion open={open} ruta={"/SingIn"} mensaje={mensaje} />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
