import React from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';

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
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return(
        <React.Fragment>
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
                <Button component={Link} to="/votante/menuPrincipal" onClick={handleClose}>Confirmar</Button>
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