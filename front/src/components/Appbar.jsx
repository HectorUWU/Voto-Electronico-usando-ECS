import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
let sesion = false;
if (
  sessionStorage.getItem("votante") != null ||
  sessionStorage.getItem("MesaElectoral") != null
) {
  sesion = true;
}
function Appbar() {
  return (
    <div>
      <AppBar position="relative" sx={{ backgroundColor: "#0099E6" }}>
        <Toolbar>
          <IconButton
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
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
                if(sessionStorage.getItem("votante") != null){
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
