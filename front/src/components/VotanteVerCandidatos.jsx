import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinkMui from "@mui/material/Link";
import { Link } from "react-router-dom";

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
  const [infoCandidatos, setInfoCandidatos] = React.useState([])
  React.useEffect(() => {
    fetch('/api/verCandidatos')
      .then((response) => {
        return response.json()
      })
      .then((candidatos) => {
        setInfoCandidatos(candidatos)
      })
  }, [])

  return (
    <Container component="main">
      <Box
        sx={{
          marginTop: 6,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridColumnGap: "10%",
          alignItems: "center",
          width: 1200,
        }}
      >
        {infoCandidatos.map((candidato, i) => (
          <Item>
            <Card sx={{ maxWidth: 400, maxHeight: 500 }}>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                align="center"
              >
                {candidato.nombre}
              </Typography>
              <CardMedia
                component="img"
                height="300"
                width="300"
                image={candidato.foto}
                alt={candidato.nombre}
              />
              <CardContent align="center">
                <LinkMui
                  href={candidato.linkPlanTrabajo}
                  underline="hover"
                  variant="h6"
                  sx={{ color: "#6600FF" }}
                >
                  {"VER PLAN DE TRABAJO"}
                </LinkMui>
              </CardContent>
            </Card>
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
        <Button
          component={Link}
          to="/votante/menuPrincipal"
          variant="contained"
          sx={{ }}
        >
          REGRESAR
        </Button>
      </Box>
    </Container>
  );
}
