import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import PersonAddIconAlt from "@mui/icons-material/PersonAddAlt";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ResponseError from "./responseError";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Confirmacion from "./Confirmacion";
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

export default function RegistroCandidatos() {
  const [fileName, setFileName] = React.useState("Abrir...");
  const [error, setError] = React.useState("");
  const [showError, setShowError] = React.useState(false);
  const [files, setfiles] = React.useState({});
  const [url, setURL] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [openCargando, setOpenCargando] = React.useState(false);
  const handleChange = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    if (file === undefined) {
      setError("Por favor selecciona una imagen");
      setShowError(true);
    } else {
      if (file.size > 1000000) {
        setURL("");
        setError(
          "El archivo es muy grande. El tamaño maximo es de 1MB. Selecciona otro"
        );
        setShowError(true);
        setFileName("Abrir...");
      } else {
        setShowError(false);
        reader.onloadend = () => {
          setfiles(file);
          setURL(reader.result);
        };
        reader.readAsDataURL(file);
        setFileName(file.name);
      }
    }
  };

  const handleSubmit = (event) => {
    let data = sessionStorage.getItem("MesaElectoral");
    data = JSON.parse(data);
    event.preventDefault();
    if (url !== "") {
      const datos = { file: url, nombre: files.name };
      const formulario = new FormData(event.currentTarget);
      if (
        formulario.get("nombre") === "" ||
        formulario.get("correo") === "" ||
        formulario.get("link") === ""
      ) {
        setError("Debes de completar el formulario");
        setShowError(true);
      } else {
        const registro = {
          nombre: formulario.get("nombre"),
          correo: formulario.get("correo"),
          link: formulario.get("link"),
          foto: "https://vota-escom.herokuapp.com/files/" + files.name,
        };
        let config = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-token": data.token,
          },
          body: JSON.stringify(registro),
        };

        fetch("https://vota-escom.herokuapp.com/api/registrarCandidato", config)
          .then((response) => response.json())
          .then((response) => {
            if (response.error) {
              setError(response.error);
              setShowError(true);
            } else {
              registro.foto = "https://vota-escom.herokuapp.com/files/" + files.name;
              let config = {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "auth-token": data.token,
                  Authorization: 'Client-ID 457be7e03ae9a71'
                },
                body: files,
              };
              setOpenCargando(true);
              fetch("https://api.imgur.com/3/image", config)
                .then((response) => response.json())
                .then((response) => {
                  setOpenCargando(false);
                  if (response.error) {
                    setError(response.error);
                    setShowError(true);
                  } else {
                    console.log(response.data.link);
                  }
                });
            }
          });
      }
    } else {
      setError("Debes seleccionar un archivo de imagen.");
      setShowError(true);
    }
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
              <PersonAddIconAlt />
            </Avatar>
            <Typography component="h1" variant="h5">
              Registrar candidato
            </Typography>
            <ResponseError error={error} showError={showError} />
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="nombre"
                label="Nombre"
                type="text"
                id="nombre"
              />
              <Item elevation={0}>{`Ingrese la foto del candidato`}</Item>
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
                    accept="/"
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
                name="correo"
                label="Correo"
                type="email"
                id="correo"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="link"
                label="Plan de trabajo"
                type="text"
                id="link"
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
            <Cargando open={openCargando} mensaje={"Cargando archivo"} />
            <Confirmacion
              open={open}
              ruta={"/mesa/menuPrincipal"}
              mensaje={"Registro exitoso"}
            />
          </Box>
        </Container>
      </ThemeProvider>
    );
  } else {
    window.location.href = "/";
  }
}
