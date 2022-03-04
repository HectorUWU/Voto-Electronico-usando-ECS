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
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

const theme = createTheme();

export default function SalaDeEsperaConteo() {
  const [listaMesa, setInfoMesa] = React.useState([]);
  React.useEffect(() => {
    fetch("/api/listaMesa")
      .then((response) => {
        return response.json();
      })
      .then((mesaElectoral) => {
        setInfoMesa(mesaElectoral);
      });
  }, []);
  let data = sessionStorage.getItem("MesaElectoral");
  data = JSON.parse(data);
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
            <Alert severity="info">
              En espera del resto de miembros de la mesa electoral para comenzar
              el conteo. Se requieren al menos t miembros para continuar
            </Alert>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Miembro</TableCell>
                    <TableCell align="center">Estatus</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listaMesa.map((integrante, i) => (
                    <TableRow key={i}>
                      <TableCell align="center">
                        {integrante.idMesaElectoral}
                      </TableCell>
                      <TableCell align="center">
                        <CircularProgress />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              variant="contained"
              disabled
              sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
            >
              Continuar
            </Button>
          </Box>
        </Container>
      </ThemeProvider>
    );
  } else {
    window.location.href = "/";
  }
}
