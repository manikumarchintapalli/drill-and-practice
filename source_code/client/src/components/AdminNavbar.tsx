// src/components/AdminNavbar.tsx
import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../lib/authUtils";
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  HIGHLIGHTS_COLOR,
  BACKGROUND_COLOR,
} from "../lib/theme";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const AdminNavbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      label: "Manage Questions",
      icon: <QuestionAnswerIcon />,
      path: "/admin/question-manager",
    },
  ];

  const handleLogout = () => {
    logoutUser();
    navigate("/sign-in");
  };

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        backgroundColor: BACKGROUND_COLOR,
        height: "100%",
        p: 2,
      }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          color: PRIMARY_COLOR,
          textAlign: "center",
          mb: 2,
        }}
      >
        Admin Panel
      </Typography>
      <Divider sx={{ mb: 2, borderColor: PRIMARY_COLOR }} />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                "&:hover": {
                  backgroundColor: `${PRIMARY_COLOR}22`, // light hover effect
                },
              }}
            >
              <ListItemIcon sx={{ color: PRIMARY_COLOR }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ color: "text.primary" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              "&:hover": {
                backgroundColor: `${PRIMARY_COLOR}22`, // same hover effect
              },
            }}
          >
            <ListItemIcon sx={{ color: PRIMARY_COLOR }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{ color: "text.primary" }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          backgroundColor: SECONDARY_COLOR,
          px: { xs: 2, md: 4 },
          py: { xs: 1, md: 1.5 },
        }}
      >
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          <Box
            component={Link}
            to="/admin/question-manager"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: HIGHLIGHTS_COLOR,
                letterSpacing: 1,
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              Admin Panel
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton
              edge="end"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: HIGHLIGHTS_COLOR }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box display="flex" alignItems="center" gap={2}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: HIGHLIGHTS_COLOR,
                    textTransform: "none",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
                sx={{
                  color: HIGHLIGHTS_COLOR,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: BACKGROUND_COLOR,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default AdminNavbar;