import React from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types'
import ResponseError from "./responseError";
import Confirmacion from "./Confirmacion";
import { Link } from "react-router-dom";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 4,
    px: 4,
    pb: 3,
  };

function ConfirmacionVotar(props) {
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState("");
    const [showError, setShowError] = React.useState(false);
    const [openConf, setOpenConf] = React.useState(false);
    const handleClick = () => {
        let data = sessionStorage.getItem("votante");
        data = JSON.parse(data);
        let datos = {
            eleccion: props.eleccion.IdCandidato,
            estadoAcademico: data.estadoAcademico,
            estadoVoto: data.estadoVoto,
        };
        let config = {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-token": data.token
        },
        body: JSON.stringify(datos),
        };
        fetch("http://localhost:8000/api/votar", config)
        .then((response) => response.json())
        .then((response) => {
            if (response.error) {
            setError(response.error);
            setShowError(true);
            } else {
                setOpenConf(true);
            }
        });
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return(
        <React.Fragment>
            <ResponseError error={error} showError={showError} />
                <Button variant='contained' sx={{backgroundColor: '#6600FF'}} onClick={handleOpen} >CONFIRMAR VOTO</Button>
                <Button variant='contained' sx={{backgroundColor: '#6600FF'}} component={Link} to="/votante/menuPrincipal"> REGRESAR </Button>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="Confirmacion"
                aria-describedby="Confirmacion-del-voto"
            >
                <Box sx={{ ...style, maxWidth: 400 }}>
                <h2 id="Confirmacion">Confirma del voto</h2>
                <p id="Confirmacion-del-voto">
                    ¿Desea confirmar su voto por el candidato {props.eleccion.nombre}?
                </p>
                <Button onClick={handleClose}>Regresar</Button>
                <Button onClick={handleClick}>Confirmar</Button>
                <Confirmacion open={openConf} mensaje={"Voto correcto"}/>
                </Box>
            </Modal>
        </React.Fragment>
    )
    
}

ConfirmacionVotar.defaultProps = {
    eleccion: {}
}

ConfirmacionVotar.propTypes = {
    eleccion: PropTypes.object
}
export default ConfirmacionVotar;