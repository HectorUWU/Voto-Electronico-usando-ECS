import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from 'react-router-dom';
const theme = createTheme();
export default function Main() {
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
          <Typography component="h1" variant="h5">
            Sistema de voto electronico usando ECS
          </Typography>
          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button component={Link} to="/SingIn" variant="contained" >Iniciar Sesion</Button>
            <Button component={Link} to="/registro" variant="contained">Registrarse </Button>
          </ButtonGroup>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
