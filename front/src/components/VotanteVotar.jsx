import React from "react";
import Radio from "@mui/material/Radio";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import ConfirmacionVotar from "./ConfirmacionVotar";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import ResponseError from "./responseError";

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        color: "grey.800",
        border: "1px solid",
        borderColor: "grey.300",
        p: 1,
        m: 1,
        borderRadius: 2,
        fontSize: "0.875rem",
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
}

export default function VotanteVotar() {
  /**
   * Estado que contendra los objetos de todos los candidatos de la base de datos
   * @type {object}
   */
  const [infoCandidatos, setInfoCandidatos] = React.useState([]);
  /**
   * Estado que contendra la eleccion del votante
   * @type {number}
   */
  const [selectedValue, setSelectedValue] = React.useState(-1);
  /**
   * Estado usado paraguardar el error que se pudiera dar
   * @type {string}
   */
  const [error, setError] = React.useState("");
  /**
   * Estado usado para mostrar el error, en caso de que lo hubiera
   * @type {boolean}
   */
  const [showError, setShowError] = React.useState(false);
  /**
   * Funcion que recupera la informacion de los candidatos
   */
  React.useEffect(() => {
    fetch("https://vota-escom.herokuapp.com/api/verCandidatos")
      .then((response) => {
        return response.json();
      })
      .then((candidatos) => {
        setInfoCandidatos(candidatos);
      })
      .catch((error) => {
        setError(error);
        setShowError(true);
      });
  }, []);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };
  let data = sessionStorage.getItem("votante");
  data = JSON.parse(data);
  if (data != null) {
    if (data.estadoVoto === 0) {
      return (
        <Container component="main">
          <Box sx={{ flexGrow: 1, marginTop: 6 }}>
            <ResponseError error={error} showError={showError} />
            <Grid
              container
              spacing={{ xs: 4, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
            >
              {infoCandidatos.map((candidato, i) => (
                <Grid item xs={4} sm={4} md={4} key={i}>
                  <Item>
                    <Card sx={{ maxWidth: 400, maxHeight: 500 }}>
                      <CardMedia
                        component="img"
                        height="300"
                        width="300"
                        image={candidato.foto}
                        alt={candidato.nombre}
                      />
                      <CardContent>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="div"
                          align="center"
                        >
                          {candidato.nombre}
                        </Typography>
                      </CardContent>
                    </Card>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Radio
                        onChange={handleChange}
                        value={i}
                        checked={selectedValue === i.toString()}
                      />
                    </Box>
                  </Item>
                </Grid>
              ))}
            </Grid>
          </Box>
          <Box
            sx={{
              marginTop: 5,
              marginBottom: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={2}>
              <ConfirmacionVotar eleccion={infoCandidatos[selectedValue]} />
            </Stack>
          </Box>
        </Container>
      );
    } else {
      window.location.href = "/SingIn";
    }
  } else {
    window.location.href = "/SingIn";
  }
}
