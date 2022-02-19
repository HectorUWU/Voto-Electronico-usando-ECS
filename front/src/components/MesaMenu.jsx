import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from 'react-router-dom';
const theme = createTheme();

export default function VotanteMenu() {
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
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
            <SupervisorAccountIcon  />
          </Avatar>
          <Typography component="h1" variant="h5" align="center">
            Bienvenido miembro de la mesa electoral
          </Typography>
          <Button
            component={Link}
            to="/registro"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Registrar candidatos
          </Button>
          <Button
            component={Link}
            to="#"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Establecer votacion
          </Button>
          <Button
            component={Link}
            to="#"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Realizar conteo de votos
          </Button>
          <Button
            component={Link}
            to="#"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Cambiar contraseña
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
