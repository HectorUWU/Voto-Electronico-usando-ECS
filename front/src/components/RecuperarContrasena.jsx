import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
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

export default function CambiarContrasena() {
  const [error, setError] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { token, id } = useParams();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let datos = {
      contrasena : data.get("contrasena"),
      repetir: data.get("repetir"),
    };
    let config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    };
    fetch("https://vota-escom.herokuapp.com/api/recuperarContrasena/"+ token + "/" + id, config)
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          setError(response.error);
          setShowError(true);
        } else {
          setOpen(true);
          
        }
      })
  };
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
            Escribe tu nueva Contrase??a
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
                  name="contrasena"
                  label="Contrase??a"
                  type="password"
                  id="contrasena"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="repetir"
                  label="Repite tu nueva contrase??a"
                  type="password"
                  id="repetir"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
            >
              Cambiar Contrase??a
            </Button>
            <Confirmacion
              open={open}
              ruta={"/"}
              mensaje={
                "Cambio de contrase??a exitoso"
              }
            />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}