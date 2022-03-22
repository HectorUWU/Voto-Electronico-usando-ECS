import React from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Alert from '@mui/material/Alert';

import PropTypes from 'prop-types'
import CircularProgress from '@mui/material/CircularProgress';
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

function Cargando(props) {
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
            <Alert severity="info">
                <strong>{props.mensaje}</strong>
            </Alert>
            <Box sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}>
           <CircularProgress/>
            </Box>
            </Box>
        </Modal>
    </React.Fragment>
    )    
}

Cargando.defaultProps = {
    open: false,
    mensaje: '',
}

Cargando.propTypes = {
    open: PropTypes.bool,
    mensaje: PropTypes.string,
}
export default Cargando;