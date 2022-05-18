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

/**
 * Componente que muestra una ventana de confirmacion con el nombre del candidato elegido 
 */  
function ConfirmacionVotar(props) {
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
        let data = sessionStorage.getItem("votante");
        data = JSON.parse(data);
        let datos = {
            // Se asigna a eleccion -1 para anular el voto o el ID del candidato en caso de haberse seleccionado alguno 
            eleccion: Object.keys(props.eleccion).length===0?-1:props.eleccion.IdCandidato,
            idVotante: data.idVotante,
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
        fetch("https://vota-escom.herokuapp.com/api/votar", config)
        .then((response) => response.json())
        .then((response) => {
            if (response.error) {
            setError(response.error);
            setShowError(true);
            } else {
                data.estadoVoto =1;
                sessionStorage.removeItem("votante")
                sessionStorage.setItem("votante", JSON.stringify(data))
                setOpenConf(true);
            }
        }).catch((error) => {
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
    return(
        <React.Fragment>
            <ResponseError error={error} showError={showError} />
            <Button variant='contained' sx={{backgroundColor: '#0099E6'}} component={Link} to="/votante/menuPrincipal"> REGRESAR </Button>
            <Button variant='contained' sx={{backgroundColor: '#0099E6'}} onClick={handleOpen} >CONFIRMAR VOTO</Button>    
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="Confirmacion"
                aria-describedby="Confirmacion-del-voto"
            >
                <Box sx={{ ...style, maxWidth: 400 }}>
                <h2 id="Confirmacion">Confirma del voto</h2>
                {/*En caso de que no haya sido seleccionada una opcion se pregintara si desea anular su voto*/}
                {Object.keys(props.eleccion).length===0?
                <p id="Anulacion-del-voto">
                    ¿Desea anular su voto? De no ser asi, por favor elija una opcion
                </p>
                :<p id="Confirmacion-del-voto">
                    ¿Desea confirmar su voto por el candidato {props.eleccion.nombre}?
                </p>
                }
                <Button onClick={handleClose}>Regresar</Button>
                <Button onClick={handleClick}>Confirmar</Button>
                <Confirmacion open={openConf} ruta={"/votante/menuPrincipal"} mensaje={"Voto correcto"}/>
                </Box>
            </Modal>
        </React.Fragment>
    )
    
}

ConfirmacionVotar.defaultProps = {
    eleccion: {}
}

ConfirmacionVotar.propTypes = {
    /**
     * Objeto que contendra la informacion del candidato elegido 
     */
    eleccion: PropTypes.object
}
export default ConfirmacionVotar;