import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import { useWebsiteData } from "../api/apiServices";
import {
  SECONDARY_COLOR,
  HIGHLIGHTS_COLOR,
  BACKGROUND_COLOR,
} from "../lib/theme";

const TopNav: React.FC = () => {
  const { data } = useWebsiteData();
  const logo = data?.navbar?.logo || "/default-logo.svg";
  const brand = data?.navbar?.brand || "KUMBHAMELA";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {/* AppBar with fixed position */}
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          backgroundColor: SECONDARY_COLOR,
          py: { xs: 1, sm: 1.5 },
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
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
                src={logo}
                alt="Logo"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  objectFit: "cover",
                  mr: 1.5,
                  border: `2px solid ${HIGHLIGHTS_COLOR}`,
                  backgroundColor: BACKGROUND_COLOR,
                }}
              />
              <Typography
                variant={isMobile ? "h6" : "h5"}
                sx={{
                  fontWeight: "bold",
                  color: HIGHLIGHTS_COLOR,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {brand}
              </Typography>
            </Box>

            {/* Sign In Button */}
            <Button
              variant="outlined"
              component={Link}
              to="/sign-in"
              size={isMobile ? "small" : "medium"}
              sx={{
                borderColor: HIGHLIGHTS_COLOR,
                color: HIGHLIGHTS_COLOR,
                "&:hover": {
                  backgroundColor: HIGHLIGHTS_COLOR,
                  color: SECONDARY_COLOR,
                },
              }}
            >
              Sign In
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Spacer to push the content down below navbar */}
      <Toolbar />
    </>
  );
};

export default TopNav;