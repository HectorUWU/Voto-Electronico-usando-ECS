import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import LinkMui from '@mui/material/Link';
import { Link } from 'react-router-dom';

const infoCandidatos=[{IdCandidato: 1, nombre: 'Juan Luis Perez Montes de Oca', foto: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png', linkPlanTrabajo: 'https://www.google.com'}, 
{IdCandidato: 2, nombre: 'Pedro', foto: 'https://us.123rf.com/450wm/thesomeday123/thesomeday1231712/thesomeday123171200009/91087331-icono-de-perfil-de-avatar-predeterminado-para-hombre-marcador-de-posici%C3%B3n-de-foto-gris-vector-de-ilu.jpg?ver=6', linkPlanTrabajo: 'https://www.google.com'},
{IdCandidato: 2, nombre: 'Hugo', foto: 'https://d500.epimg.net/cincodias/imagenes/2016/03/16/lifestyle/1458143779_942162_1458143814_noticia_normal.jpg', linkPlanTrabajo: 'https://www.google.com'},
{IdCandidato: 2, nombre: 'Paco', foto: 'https://images.squarespace-cdn.com/content/v1/57d03e423e00be61bf183b3d/1525433467068-RHO7658EDIFFHJGVYHZ5/GettyImages-884727654+%281%29.jpg?format=1000w', linkPlanTrabajo: 'https://www.google.com'},
{IdCandidato: 2, nombre: 'Luis', foto: 'C:\\Users\\USER\\Documents\\ESCOM\\TT\\icono.jpg', linkPlanTrabajo: 'https://www.google.com'}]

function Item(props) {
    const { sx, ...other } = props;
    return (
      <Box
        sx={{
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
          color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          p: 1,
          m: 1,
          borderRadius: 2,
          fontSize: '0.875rem',
          fontWeight: '700',
          ...sx,
        }}
        {...other}
      />
    );
  }

  export default function VotanteVotar(){
      return(
          <Container component="main" >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridColumnGap: '10%',
              alignItems: "center",
              width: 1200, 
            }}
          >
            {infoCandidatos.map((candidato,i) => (  
                <Item>
                    <Card sx={{ maxWidth: 400, maxHeight: 500 }}>
                        <Typography gutterBottom variant="h5" component="div" align="center">
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
                            <LinkMui href={candidato.linkPlanTrabajo} underline="hover" variant="h6" sx={{color: '#6600FF'}}>
                                {'VER PLAN DE TRABAJO'}
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
                <Button component={Link} to="/votante/menuPrincipal" variant="contained" sx={{backgroundColor: '#6600FF'}}>REGRESAR</Button>
            </Box>   
      </Container>
      )
      
  }