import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { alpha } from "@mui/material/styles";
import { useWebsiteData } from "../api/apiServices";
import { SECONDARY_COLOR, HIGHLIGHTS_COLOR } from "../lib/theme";

const TopNav: React.FC = () => {
  const { data } = useWebsiteData();
  const logo = data?.navbar?.logo || "/default-logo.svg";
  const brand = data?.navbar?.brand || "KUMBHAMELA";

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // match these heights in the spacer Toolbar below
  const NAV_HEIGHT = isMobile ? 80 : 95;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: SECONDARY_COLOR,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Container
          maxWidth={false}
          disableGutters
          sx={{ px: { xs: 2, sm: 4, md: 6 } }}
        >
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // fixed height + vertical padding
              height: NAV_HEIGHT,
              py: { xs: 1.5, sm: 2 },
            }}
          >
            {/* Logo + Brand */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
            >
              <Avatar
                src={logo}
                alt="logo"
                sx={{
                  width: isMobile ? 40 : 56,
                  height: isMobile ? 40 : 56,
                  border: `3px solid gold`,
                  boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                  backgroundColor: alpha(HIGHLIGHTS_COLOR, 0.1),
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              />

              <Typography
                variant={isMobile ? "h6" : "h5"}
                sx={{
                  ml: 1.5,
                  color: "#ffffff",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                {brand}
              </Typography>
            </Box>

            {/* Sign In */}
            <Button
              component={Link}
              to="/sign-in"
              variant="contained"
              size={isMobile ? "small" : "medium"}
              sx={{
                backgroundColor: HIGHLIGHTS_COLOR,
                color: SECONDARY_COLOR,
                textTransform: "none",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: "50px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  backgroundColor: alpha(HIGHLIGHTS_COLOR, 0.85),
                  transform: "translateY(-1px)",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
                },
              }}
            >
              Sign In
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* spacer so page content sits below the fixed navbar */}
      <Toolbar sx={{ height: NAV_HEIGHT }} />
    </>
  );
};

export default TopNav;