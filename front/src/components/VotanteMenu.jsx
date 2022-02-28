import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link } from "react-router-dom";

const theme = createTheme();

export default function VotanteMenu() {
  let data = sessionStorage.getItem("votante");
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
            <Avatar sx={{ m: 1, backgroundColor: "#0099E6" }}>
              <HowToVoteIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Bienvenido {data.boleta}
            </Typography>
            <Button
              component={Link}
              to="/votante/verCandidatos"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
            >
              Ver candidatos
            </Button>
            <Button
              component={Link}
              to="/votante/votar"
              fullWidth
              variant="contained"
              disabled={
                data.estadoVoto === 0 && data.estadoAcademico === 1
                  ? false
                  : true
              }
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
            >
              Votar
            </Button>
            <Button
              component={Link}
              to=""
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
            >
              Cambiar contraseña
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
  } else {
    window.location.href = "/SingIn";
  }
}
