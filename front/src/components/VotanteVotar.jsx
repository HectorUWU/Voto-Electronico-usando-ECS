import React from "react";
import Radio from "@mui/material/Radio";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import ConfirmacionVotar from "./ConfirmacionVotar";

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
  return (
    <Container component="main">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridColumnGap: "20%",
          alignItems: "center",
          width: 1200,
        }}
      >
        {infoCandidatos.map((candidato, i) => (
          <Item>
            <Card sx={{ maxWidth: 600, maxHeight: 600 }}>
              <CardMedia
                component="img"
                height="450"
                width="450"
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
        ))}
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
        <ConfirmacionVotar eleccion={infoCandidatos[selectedValue]} />
      </Box>
    </Container>
  );
}
