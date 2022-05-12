import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ResponseError from "./responseError";
import Confirmacion from "./Confirmacion";
import Avatar from "@mui/material/Avatar";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Cargando from "./Cargando";

const Input = styled("input")({
  display: "none",
});

const Item = styled(Paper)(({ theme }) => ({
  textAlign: "center",
  height: 50,
  lineHeight: "50px",
}));

const theme = createTheme();

export default function Main() {
  const [error, setError] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const [boletasActualizadas, setBoletasActualizadas] = React.useState(false);
  const [fileName, setFileName] = React.useState("Abrir...");
  const [url, setURL] = React.useState("");
  const [files, setfiles] = React.useState({});
  const [openCargando, setOpenCargando] = React.useState(false);

  const handleChange = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];

    if (event.target.files[0] != null) {
      setFileName(event.target.files[0].name);
      reader.onloadend = () => {
        setfiles(file);
        setURL(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFileName("Abrir...");
      setURL("");
    }
  };

  const handleSubmit = (event) => {
    let sesion = sessionStorage.getItem("MesaElectoral");
    sesion = JSON.parse(sesion);
    event.preventDefault();
    const datos = { file: url, nombre: files.name };
    let config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": sesion.token,
      },
      body: JSON.stringify(datos),
    };
    setOpenCargando(true);
    fetch("https://vota-escom.herokuapp.com/api/actualizarAlumnos", config)
      .then((response) => response.json())
      .then((response) => {
        setOpenCargando(false);
        if (response.error) {
          setError(response.error);
          setShowError(true);
        } else {
            setBoletasActualizadas(true);
        }
      });
  };
  let data = sessionStorage.getItem("MesaElectoral");
  data = JSON.parse(data);
  if (data != null) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main">
          <Cargando open={openCargando} mensaje={"Cargando archivo"} />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Confirmacion
              open={boletasActualizadas}
              ruta={"/mesa/menuPrincipal"}
              mensaje={"El estado académico de los alumnos ha sido actualizado"}
            />
            <Avatar sx={{ m: 1, bgcolor: "#0099E6" }}>
              <CoPresentIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Validar alumnos inscritos
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <ResponseError error={error} showError={showError} />
              <Item elevation={0}>{`Ingrese archivo de boletas`}</Item>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <label htmlFor="file">
                  <Input
                    required
                    onChange={handleChange}
                    accept=".xls,.xlsx"
                    id="file"
                    name="file"
                    multiple
                    type="file"
                  />
                  <Button variant="contained" component="span">
                    {fileName}
                  </Button>
                </label>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: "#0099E6" }}
              >
                Continuar
              </Button>
            </Box>
            <Item
              elevation={0}
            >{`Nota: El archivo debe ser tipo excel (.xls/.xlsx) y la columna de boletas debe tener el encabezado "boleta"`}</Item>
          </Box>
        </Container>
      </ThemeProvider>
    );
  } else {
    window.location.href = "/";
  }
}
