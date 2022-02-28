import React from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 4,
    px: 4,
    pb: 3,
  };

function Confirmacion(props) {
return(
    <React.Fragment>
        <Modal
            hideBackdrop
            keepMounted
            open={props.open}
            aria-labelledby="Confirmacion-guardado"
            aria-describedby="Confirmacion-de-guardado"
        >
            <Box sx={{ ...style, maxWidth: 600 }}>
            <Alert severity="success">
                <AlertTitle>Listo</AlertTitle>
                <strong>{props.mensaje}</strong>
            </Alert>
            <Button component={Link} to={props.ruta} >Regresar</Button>
            </Box>
        </Modal>
    </React.Fragment>
    )    
}

Confirmacion.defaultProps = {
    open: false,
    mensaje: '',
    ruta:''
}

Confirmacion.propTypes = {
    open: PropTypes.bool,
    mensaje: PropTypes.string,
    ruta: PropTypes.string
}
export default Confirmacion;