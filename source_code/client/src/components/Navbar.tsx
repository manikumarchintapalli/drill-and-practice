import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  Box,
  List,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink, Link } from "react-router-dom";
import { useWebsiteData } from "../api/apiServices";
import { getAuthenticatedUser, logoutUser } from "../lib/authUtils";
import {
  HIGHLIGHTS_COLOR,
  SECONDARY_COLOR,
  PRIMARY_COLOR,
  BACKGROUND_COLOR,
} from "../lib/theme";

const Navbar: React.FC = () => {
  const { data } = useWebsiteData();
  const user = getAuthenticatedUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const guestLinks = [
    { label: "Sign In", to: "/sign-in" },
    { label: "Sign Up", to: "/sign-up" },
  ];
  const authLinks =
    data?.navbar?.links?.map((l: any) => ({ label: l.label, to: l.value })) || [
      { label: "Home", to: "/" },
      { label: "Practice", to: "/practice" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Profile", to: "/profile" },
    ];

  const renderLinks = (drawer = false) => {
    const links = user ? authLinks : guestLinks;
    return links.map((link) =>
      drawer ? (
        <ListItemButton
          key={link.to}
          component={NavLink}
          to={link.to}
          onClick={() => setDrawerOpen(false)}
          sx={{
            "& .MuiListItemText-root": {
              color: PRIMARY_COLOR,
              fontWeight: "bold",
            },
          }}
        >
          <ListItemText primary={link.label} />
        </ListItemButton>
      ) : (
        <NavLink
          key={link.to}
          to={link.to}
          style={{ textDecoration: "none" }}
        >
          {({ isActive }) => (
            <Button
              sx={{
                textDecoration: isActive ? "underline" : "none",
                color: isActive ? HIGHLIGHTS_COLOR : theme.palette.common.white,
                ml: theme.spacing(3),
                fontWeight: 600,
                fontSize: "1rem",
                letterSpacing: "0.5px",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  color: HIGHLIGHTS_COLOR,
                },
              }}
            >
              {link.label}
            </Button>
          )}
        </NavLink>
      )
    );
  };

  return (
    <>
      <AppBar
        position="fixed" // <-- make navbar fixed
        elevation={3}
        sx={{
          backgroundColor: SECONDARY_COLOR,
          py: { xs: 1, sm: 1.2 },
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* Logo and Brand */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              component="img"
              src={data?.navbar?.logo || "/logo.png"}
              alt="Logo"
              sx={{
                height: 40,
                width: 40,
                borderRadius: "50%",
                objectFit: "cover",
                backgroundColor: BACKGROUND_COLOR,
                border: `2px solid ${HIGHLIGHTS_COLOR}`,
                boxShadow: `0 2px 6px rgba(0,0,0,0.25)`,
              }}
            />

            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Poppins', sans-serif",
                color: HIGHLIGHTS_COLOR,
                fontWeight: 700,
                fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                letterSpacing: "1.5px",
                ml: 1.5,
                userSelect: "none",
              }}
            >
              {data?.navbar?.brand || "Kumbhamela"}
            </Typography>
          </Box>

          {/* Links */}
          {!isMobile ? (
            <Box display="flex" alignItems="center">
              {renderLinks(false)}
              {user && (
                <Button
                  variant="contained"
                  size="small"
                  onClick={logoutUser}
                  sx={{
                    ml: 3,
                    fontWeight: 600,
                    backgroundColor: HIGHLIGHTS_COLOR,
                    color: SECONDARY_COLOR,
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: HIGHLIGHTS_COLOR,
                      opacity: 0.9,
                    },
                  }}
                >
                  Sign Out
                </Button>
              )}
            </Box>
          ) : (
            <IconButton
              edge="end"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: HIGHLIGHTS_COLOR }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { backgroundColor: BACKGROUND_COLOR },
        }}
      >
        <Box width={240} sx={{ mt: 2 }}>
          <List>
            {renderLinks(true)}
            {user && (
              <ListItemButton
                onClick={() => {
                  logoutUser();
                  setDrawerOpen(false);
                }}
                sx={{
                  "& .MuiListItemText-root": {
                    color: PRIMARY_COLOR,
                    fontWeight: "bold",
                  },
                }}
              >
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;