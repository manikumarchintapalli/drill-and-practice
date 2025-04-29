// src/components/Navbar.tsx

import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
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
import { useWebsiteData } from "../api/apiServices";
import { getAuthenticatedUser, logoutUser } from "../lib/authUtils";
import {
  HIGHLIGHTS_COLOR,
  SECONDARY_COLOR,
  PRIMARY_COLOR,
  BACKGROUND_COLOR,
} from "../lib/theme";

interface NavLinkItem {
  label: string;
  to: string;
}

const Navbar: React.FC = () => {
  const { data } = useWebsiteData();
  const user = getAuthenticatedUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const guestLinks: NavLinkItem[] = [
    { label: "Sign In", to: "/sign-in" },
    { label: "Sign Up", to: "/sign-up" },
  ];
  const authLinks: NavLinkItem[] =
    data?.navbar?.links?.map((l: any) => ({ label: l.label, to: l.value })) || [
      { label: "Home", to: "/" },
      { label: "Practice", to: "/practice" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Profile", to: "/profile" },
    ];

  const renderLinks = (inDrawer = false) => {
    const links = user ? authLinks : guestLinks;
    return links.map((link) =>
      inDrawer ? (
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
        <NavLink key={link.to} to={link.to} style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <Button
              sx={{
                textDecoration: isActive ? "underline" : "none",
                color: isActive ? HIGHLIGHTS_COLOR : theme.palette.common.white,
                ml: theme.spacing(3),
                fontWeight: 600,
                fontSize: "1rem",
                letterSpacing: "0.5px",
                transition: "color 0.2s",
                "&:hover": { color: HIGHLIGHTS_COLOR },
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
        position="fixed"
        elevation={3}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: SECONDARY_COLOR,
          py: { xs: 1, sm: 1.2 },
          transition: "top 0.3s ease-in-out",
        }}
      >
        <Toolbar
          sx={{
            width: "100%",
            maxWidth: "1200px",
            mx: "auto",
            px: { xs: 2, sm: 3 },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Logo & Brand */}
          <Box
            component={Link}
            to="/"
            sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
          >
            <Box
              component="img"
              src={data?.navbar?.logo || "/logo.png"}
              alt="Logo"
              sx={{
                height: 40,
                width: 40,
                borderRadius: "50%",
                backgroundColor: BACKGROUND_COLOR,
                border: `2px solid ${HIGHLIGHTS_COLOR}`,
                boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
              }}
            />
            <Typography
              variant="h5"
              sx={{
                ml: 1.5,
                color: HIGHLIGHTS_COLOR,
                fontWeight: 700,
                letterSpacing: "1.5px",
                userSelect: "none",
              }}
            >
              {data?.navbar?.brand || "Drill & Practice"}
            </Typography>
          </Box>

          {/* Links or Hamburger */}
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
                    "&:hover": { opacity: 0.9 },
                  }}
                >
                  Sign Out
                </Button>
              )}
            </Box>
          ) : (
            <IconButton
              sx={{ color: HIGHLIGHTS_COLOR }}
              onClick={(e) => {
                setDrawerOpen(true);
                // immediately blur the button so focus moves into the drawer
                (e.currentTarget as HTMLElement).blur();
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{
          keepMounted: true,
          disableScrollLock: true,
        }}
        PaperProps={{ sx: { backgroundColor: BACKGROUND_COLOR } }}
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