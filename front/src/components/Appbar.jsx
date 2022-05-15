import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import Box from "@mui/material/Box";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import HomeIcon from "@mui/icons-material/Home";
import HowToVoteIcon from "@mui/icons-material/HowToVote";
import EventIcon from "@mui/icons-material/Event";
import PasswordIcon from "@mui/icons-material/Password";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";

let sesion = false;
const anchor = "left";
if (
  sessionStorage.getItem("votante") != null ||
  sessionStorage.getItem("MesaElectoral") != null
) {
  sesion = true;
}
function Appbar() {
  const [estadoVotacion, setEstadoVotacion] = React.useState("");
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  React.useEffect(() => {
    fetch("https://vota-escom.herokuapp.com/api/verEstadoUltimaVotacion")
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        setEstadoVotacion(response.estado);
      });
  }, []);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const mesaList = (anchor) => (
    <List>
      <ListItem key={"main"} disablePadding>
        <ListItemButton component={Link} to="/mesa/menuPrincipal">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={"Menú principal"} />
        </ListItemButton>
      </ListItem>
      <Divider />
      {(estadoVotacion === "preparacion") |
      (estadoVotacion === "listoParaIniciar") ? (
        <ListItem key={"regCan"} disablePadding>
          <ListItemButton component={Link} to="/mesa/registrarCandidato">
            <ListItemIcon>
              <HowToRegIcon />
            </ListItemIcon>
            <ListItemText primary={"Registrar candidatos"} />
          </ListItemButton>
        </ListItem>
      ) : (
        ""
      )}
      {estadoVotacion === "finalizado" ? (
        <ListItem key={"votacion"} disablePadding>
          <ListItemButton component={Link} to="/mesa/establecerVotacion">
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary={"Establecer votación"} />
          </ListItemButton>
        </ListItem>
      ) : (
        ""
      )}
      {estadoVotacion === "listoParaConteo" ? (
        <ListItem key={"conteo"} disablePadding>
          <ListItemButton component={Link} to="/mesa/recuperarVotos">
            <ListItemIcon>
              <HowToVoteIcon />
            </ListItemIcon>
            <ListItemText primary={"Realizar conteo de votos"} />
          </ListItemButton>
        </ListItem>
      ) : (
        ""
      )}
      {(estadoVotacion === "listoParaConteo") |
      (estadoVotacion === "activo") ? (
        ""
      ) : (
        <ListItem key={"cambiarContrasena"} disablePadding>
          <ListItemButton component={Link} to="/cambiarContrasena">
            <ListItemIcon>
              <PasswordIcon />
            </ListItemIcon>
            <ListItemText primary={"Cambiar contraseña"} />
          </ListItemButton>
        </ListItem>
      )}
      {(estadoVotacion === "listoParaConteo") |
      (estadoVotacion === "activo") ? (
        ""
      ) : (
        <ListItem key={"validarAlumnos"} disablePadding>
          <ListItemButton component={Link} to="/mesa/validarAlumnos">
            <ListItemIcon>
              <AppRegistrationIcon />
            </ListItemIcon>
            <ListItemText
              primary={"Actualizar estado academico de los alumnos"}
            />
          </ListItemButton>
        </ListItem>
      )}
      <Divider />
      <ListItem key={"logout"} disablePadding>
        <ListItemButton
          component={Link}
          to="/"
          onClick={() => {
            sessionStorage.removeItem("MesaElectoral");
            window.location.href = "/";
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={"Cerrar sesión"} />
        </ListItemButton>
      </ListItem>
    </List>
  );

  const defaultList = () => (
    <List>
      <ListItem key={"Login"} disablePadding>
        <ListItemButton component={Link} to="/SingIn">
          <ListItemIcon>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary={"Iniciar sesion"} />
        </ListItemButton>
      </ListItem>
      <ListItem key={"Register"} disablePadding>
        <ListItemButton component={Link} to="/registro">
          <ListItemIcon>
            <AppRegistrationIcon />
          </ListItemIcon>
          <ListItemText primary={"Registrarse"} />
        </ListItemButton>
      </ListItem>
    </List>
  );

  const votanteList = (anchor) => (
    <List>
      <ListItem key={"main"} disablePadding>
        <ListItemButton component={Link} to="/votante/menuPrincipal">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary={"Menú principal"} />
        </ListItemButton>
      </ListItem>
      <Divider />
      {(estadoVotacion === "activo") |
      (estadoVotacion === "listoParaConteo") ? (
        <ListItem key={"vercand"} disablePadding>
          <ListItemButton component={Link} to="/votante/verCandidatos">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={"Ver candidatos"} />
          </ListItemButton>
        </ListItem>
      ) : (
        ""
      )}
      {data?.estadoVoto === 0 &&
      data?.estadoAcademico === 1 &&
      estadoVotacion === "activo" ? (
        <ListItem key={"votar"} disablePadding>
          <ListItemButton component={Link} to="/votante/votar">
            <ListItemIcon>
              <HowToVoteIcon />
            </ListItemIcon>
            <ListItemText primary={"Votar"} />
          </ListItemButton>
        </ListItem>
      ) : (
        ""
      )}
      <ListItem key={"cambiacontra"} disablePadding>
        <ListItemButton component={Link} to="/cambiarContrasena">
          <ListItemIcon>
            <PasswordIcon />
          </ListItemIcon>
          <ListItemText primary={"Cambiar contraseña"} />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem key={"logout"} disablePadding>
        <ListItemButton
          component={Link}
          to="/"
          onClick={() => {
            sessionStorage.removeItem("votante");
            window.location.href = "/";
          }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={"Cerrar sesión"} />
        </ListItemButton>
      </ListItem>
    </List>
  );
  let lista = defaultList();
  let data;
  if (sessionStorage.getItem("MesaElectoral") != null) {
    lista = mesaList();
  } else if (sessionStorage.getItem("votante") != null) {
    data = sessionStorage.getItem("votante");
    data = JSON.parse(data);
    lista = votanteList();
  }
  return (
    <div>
      <AppBar position="relative" sx={{ backgroundColor: "#0099E6" }}>
        <Toolbar>
          <IconButton
            onClick={toggleDrawer(anchor, true)}
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            <Box
              sx={{
                width: anchor === "top" || anchor === "bottom" ? "auto" : 250,
              }}
              role="presentation"
              onClick={toggleDrawer(anchor, false)}
              onKeyDown={toggleDrawer(anchor, false)}
            >
              {lista}
            </Box>
          </SwipeableDrawer>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Vota-ESCOM
          </Typography>
          {sesion ? null : (
            <Button component={Link} to="/SingIn" color="inherit">
              INICIAR SESION
            </Button>
          )}
          {sesion ? (
            <Button
              component={Link}
              to="/"
              color="inherit"
              onClick={() => {
                if (sessionStorage.getItem("votante") != null) {
                  sessionStorage.removeItem("votante");
                  window.location.href = "/";
                } else {
                  sessionStorage.removeItem("MesaElectoral");
                  window.location.href = "/";
                }
              }}
            >
              CERRAR SESION
            </Button>
          ) : (
            <Button component={Link} to="/registro" color="inherit">
              REGISTRARSE
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Appbar;
