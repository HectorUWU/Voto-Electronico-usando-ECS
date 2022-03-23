import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import ResponseError from "./responseError";
import Confirmacion from "./Confirmacion";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 4,
  px: 4,
  pb: 3,
};

/**
 * Componente que muestra una ventana de confirmacion para iniciar la votacion
 */
function ConfirmacionInicioVotacion(props) {
  /**
   * Estado usado para abrir o cerrar la ventanade confirmacion del voto
   * @type {boolean}
   */
  const [open, setOpen] = React.useState(false);
  /**
   * Estado usado paraguardar el error que se pudiera dar
   * @type {string}
   */
  const [error, setError] = React.useState("");
  /**
   * Estado usado para mostrar el error, en caso de que lo hubiera
   * @type {boolean}
   */
  const [showError, setShowError] = React.useState(false);
  /**
   * Estado usado para abrir el componente de confirmacion en caso de que el voto haya sido guardado exitosamente
   * @type {boolean}
   */
  const [openConf, setOpenConf] = React.useState(false);
  /**
   * Funcion en donde se manda los datos del votante y su eleccion a la peticion de votar
   */
  const handleClick = () => {
    let datasesion = sessionStorage.getItem("MesaElectoral");
    datasesion = JSON.parse(datasesion);
    let datos = {
      estadoVotacion: props.estadoVotacion,
    };
    let config = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": datasesion.token,
      },
      body: JSON.stringify(datos),
    };
    fetch("https://vota-escom.herokuapp.com/api/iniciarVotacion", config)
      .then((response) => response.json())
      .then((response) => {
        if (response.error) {
          setError(response.error);
          setShowError(true);
        } else {
          setOpenConf(true);
        }
      })
      .catch((error) => {
        setError(error);
        setShowError(true);
      });
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <React.Fragment>
      <ResponseError error={error} showError={showError} />
      <Button
        fullWidth
        disabled={props.estadoVotacion === "listoParaIniciar" ? false : true}
        variant="contained"
        sx={{ mt: 3, mb: 2, backgroundColor: "#0099E6" }}
        onClick={handleOpen}
      >
        INICIAR VOTACION
      </Button>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="Confirmacion"
        aria-describedby="Confirmacion-del-voto"
      >
        <Box sx={{ ...style, maxWidth: 400 }}>
          <h2 id="Confirmacion">Confirmacion de inicio de votacion</h2>
          <p id="ConfirmacionVotacion">
            ¿Desea iniciar el proceso de votacion? Una vez iniciado no podra
            agregar mas candidatos
          </p>
          <Button onClick={handleClose}>Regresar</Button>
          <Button onClick={handleClick}>Confirmar</Button>
          <Confirmacion
            open={openConf}
            ruta={"/SingIn"}
            mensaje={"Votacion iniciada con exito"}
          />
        </Box>
      </Modal>
    </React.Fragment>
  );
}

ConfirmacionInicioVotacion.defaultProps = {
  estadoVotacion: "",
};

ConfirmacionInicioVotacion.propTypes = {
  /**
   * String que contendra el estado de la votacion actual
   */
  estadoVotacion: PropTypes.string,
};
export default ConfirmacionInicioVotacion;
