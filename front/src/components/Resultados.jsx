import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Button from "@mui/material/Button";
import Confirmacion from "./Confirmacion";
import ResponseError from "./responseError";

const theme = createTheme();

export default function Resultados() {
  const [open, setOpen] = React.useState(false);
  const [mensaje, setMensaje] = React.useState("");

  const [infoCandidatos, setInfoCandidatos] = React.useState([]);
  React.useEffect(() => {
    fetch("/api/verCandidatos")
      .then((response) => {
        return response.json();
      })
      .then((candidatos) => {
        setInfoCandidatos(candidatos);
      });
  }, []);

  let votosTotales = 0;
  infoCandidatos.forEach((candidato) => {
    votosTotales += candidato.numeroVotos;
  });

  let data = sessionStorage.getItem("MesaElectoral");
  data = JSON.parse(data);

  const publicar = (event) => {
    event.preventDefault();
    let data = sessionStorage.getItem("MesaElectoral");
    data = JSON.parse(data);
    let config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": data.token,
      },
    };
    fetch("https://vota-escom.herokuapp.com/api/publicarResultados", config)
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          setMensaje(response.error);
          setOpen(true);
        } else {
          console.log("Fin de proceso");
          setOpen(true);
        }
      });
  };
  
  if (data != null) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="md">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Confirmacion
              open={open}
              ruta={"/mesa/menuPrincipal"}
              mensaje={mensaje}
            />
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Candidato</TableCell>
                    <TableCell align="center">Total de votos</TableCell>
                    <TableCell align="center">Porcentaje </TableCell>
                    <TableCell align="center">Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {infoCandidatos.map((candidato, i) => (
                    <TableRow key={i}>
                      <TableCell align="center">{candidato.nombre}</TableCell>
                      <TableCell align="center">
                        {candidato.numeroVotos}
                      </TableCell>
                      <TableCell align="center">
                        {((100 / votosTotales) * candidato.numeroVotos).toFixed(
                          2
                        )}{" "}
                        %
                      </TableCell>
                      <TableCell align="center">
                        {candidato.resultado === 1 ? "Electo" : "No electo"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

              <Button
                onClick = {publicar}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#0099E6" }}
              >
                Publicar resultados
              </Button>
            </Box>
        </Container>
      </ThemeProvider>
    );
  } else {
    window.location.href = "/";
  }
}
