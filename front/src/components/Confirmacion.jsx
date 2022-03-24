import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 4,
  px: 4,
  pb: 3,
};

/**
 * Ventana en la cual se mostrar un mensaje de confirmacion y el boton que nos guiara a una ruta dada
 */
function Confirmacion(props) {
  return (
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button component={Link} to={props.ruta}>
              Continuar
            </Button>
          </Box>
        </Box>
      </Modal>
    </React.Fragment>
  );
}

Confirmacion.defaultProps = {
  open: false,
  mensaje: "",
  ruta: "",
};

Confirmacion.propTypes = {
  /**
   * Variable que controla cuando se abre la ventana
   */
  open: PropTypes.bool,
  /**
   * Mensaje que se mostrar en la ventana
   */
  mensaje: PropTypes.string,
  /**
   * Ruta a la que se mandara despues de oprimir el boton de continuar
   */
  ruta: PropTypes.string,
};
export default Confirmacion;
