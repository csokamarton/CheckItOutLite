import { Link } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { MouseEvent, useState } from "react";
import GlobalEntities from "../store/GlobalEntities";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    localStorage.clear();
    handleMenuClose();
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#0044D7" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ color: "#F5F5DC", fontWeight: "bold" }}>
          CheckItOut
        </Typography>

        {isMobile ? (
          <>
            <IconButton edge="end" color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/home" onClick={handleMenuClose}>
                Főoldal megtekintése
              </MenuItem>
              <MenuItem component={Link} to="/newTask" onClick={handleMenuClose}>
                Új feladat felvétele
              </MenuItem>
              <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                Profil megtekintése
              </MenuItem>
              {GlobalEntities.user.role === "admin" && (
                <MenuItem component={Link} to="/admin/users" onClick={handleMenuClose}>
                  Admin megtekintése
                </MenuItem>
              )}
              <MenuItem component={Link} to="/" onClick={logOut}>
                Kijelentkezés
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" component={Link} to="/home">
              Főoldal
            </Button>
            <Button color="inherit" component={Link} to="/newTask">
              Új feladat
            </Button>
            <Button color="inherit" component={Link} to="/profile">
              Profil
            </Button>
            {GlobalEntities.user.role === "admin" && (
              <Button color="inherit" component={Link} to="/admin/users">
                Admin
              </Button>
            )}
            <Button color="inherit" component={Link} to="/" onClick={logOut}>
              Kijelentkezés
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
