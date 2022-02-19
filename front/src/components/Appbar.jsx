import {
  Typography,
  AppBar,
  CssBaseline,
  Toolbar,
  IconButton,
} from "@material-ui/core";
import MenuIcon from "@mui/icons-material/Menu";

function Appbar() {
  return (
    <div>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" align="center">
            Vota-ESCOM
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Appbar;
