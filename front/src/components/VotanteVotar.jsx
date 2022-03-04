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

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "#101010" : "#fff",
        color: (theme) =>
          theme.palette.mode === "dark" ? "grey.300" : "grey.800",
        border: "1px solid",
        borderColor: (theme) =>
          theme.palette.mode === "dark" ? "grey.800" : "grey.300",
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
  const [selectedValue, setSelectedValue] = React.useState(-1);

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
