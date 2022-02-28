import React from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types'
import ResponseError from "./responseError";
// import { Link } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
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
                window.location.href = "/votante/menuPrincipal";
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
            <Button variant="contained" onClick={handleOpen} sx={{backgroundColor: '#6600FF'}}>CONFIRMAR VOTO</Button>
            <Modal
                hideBackdrop
                open={open}
                onClose={handleClose}
                aria-labelledby="Confirmacion"
                aria-describedby="Confirmacion-del-voto"
            >
                <Box sx={{ ...style, width: 400 }}>
                <h2 id="Confirmacion">Confirma del voto</h2>
                <p id="Confirmacion-del-voto">
                    ¿Desea confirmar su voto por el candidato {props.eleccion.nombre}?
                </p>
                <Button onClick={handleClose}>Regresar</Button>
                <Button onClick={handleClick}>Confirmar</Button>
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