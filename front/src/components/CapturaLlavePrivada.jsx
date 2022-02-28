import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ResponseError from "./responseError";
import { styled } from "@mui/material/styles";

const theme = createTheme();

const Input = styled("input")({
  display: "none",
});

export default function CapturaLlavePrivada() {
  const [error, setError] = React.useState("");
  const [showError, setShowError] = React.useState(false);

  const handleSubmit = (event) => {};

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
            <label htmlFor="llave">
              <Input
                required
                accept="file/txt"
                id="llave"
                multiple
                type="file"
              />
              <Button variant="contained" component="span">
                Abrir
              </Button>
            </label>

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
              Continuar
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
