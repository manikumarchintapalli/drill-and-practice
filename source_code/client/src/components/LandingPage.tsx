import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import TopNav from "./topNav";
import { HIGHLIGHTS_COLOR } from "../lib/theme";

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const statusColors = [
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
  ];

  return (
    <>
      <TopNav />

      <Box
        component="section"
        sx={{
          position: "fixed",
          inset: 0,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // softer radial background
          background: `radial-gradient(circle at center, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 80%)`,
          color: theme.palette.common.white,
        }}
      >
        {/* floating gradient blobs */}
        {[
          { size: 500, x: -150, y: -100, color: HIGHLIGHTS_COLOR },
          { size: 350, x: 200, y: -200, color: theme.palette.warning.light },
          { size: 300, x: 250, y: 250, color: theme.palette.secondary.light },
        ].map(({ size, x, y, color }, i) => (
          <Box
            key={i}
            component={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.3, duration: 1.2, ease: "easeOut" }}
            sx={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "50%",
              background: `${color}33`,
              top: y,
              left: x,
              filter: "blur(80px)",
            }}
          />
        ))}

        {/* main content wrapper */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 1600,
            px: { xs: 4, sm: 10, md: 16, lg: 24 },
            zIndex: 1,
            display: "flex",
            flexDirection: isMobile ? "column-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: theme.spacing(8),
          }}
        >
          {/* left: floating dashboard */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ flex: 1, display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                width: { xs: 280, sm: 340 },
                backgroundColor: theme.palette.background.paper,
                borderRadius: theme.shape.borderRadius * 2,
                transform: "rotate(-4deg)",
                boxShadow: theme.shadows[12],
                p: 3,
              }}
            >
              <Box display="flex" gap={1} mb={2}>
                {[
                  theme.palette.info.light,
                  theme.palette.success.light,
                  theme.palette.warning.light,
                  theme.palette.error.light,
                ].map((c, idx) => (
                  <Box
                    key={idx}
                    sx={{ flex: 1, height: 32, bgcolor: c, borderRadius: 1 }}
                  />
                ))}
              </Box>
              <Stack spacing={1}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Box
                    key={i}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      bgcolor: theme.palette.grey[100],
                      px: 2,
                      py: 1,
                      borderRadius: theme.shape.borderRadius,
                    }}
                  >
                    <Box
                      sx={{
                        width: `${60 + i * 3}%`,
                        height: 8,
                        bgcolor: theme.palette.grey[300],
                        borderRadius: 1,
                      }}
                    />
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        bgcolor: statusColors[i % statusColors.length],
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Box>
          </motion.div>

          {/* right: copy + CTA */}
          <Box flex={1} textAlign={isMobile ? "center" : "left"}>
            <Typography
              variant="h2"
              fontWeight="bold"
              gutterBottom
              sx={{
                color: HIGHLIGHTS_COLOR,
                fontSize: { xs: "2.2rem", sm: "3rem", md: "3.6rem" },
                lineHeight: 1.2,
              }}
            >
              A New Way to&nbsp;
              <Box component="span" color="common.white">
                Practice
              </Box>
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: theme.palette.grey[200],
                mb: 5,
                fontSize: { xs: "1rem", sm: "1.1rem" },
                maxWidth: 500,
                mx: isMobile ? "auto" : 0,
                lineHeight: 1.6,
              }}
            >
              KUMBHAMELA helps you learn faster with hands-on practice,
              curated questions, and a beautiful, interactive environment.
            </Typography>

            <Button
              component={Link}
              to="/sign-up"
              size="large"
              sx={{
                px: 6,
                py: 2,
                borderRadius: "50px",
                fontWeight: 700,
                fontSize: "1.1rem",
                textTransform: "none",
                background: `linear-gradient(90deg, ${HIGHLIGHTS_COLOR}, ${theme.palette.warning.dark})`,
                color: "#fff",
                boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
                },
              }}
            >
              Create Account
            </Button>
          </Box>
        </Box>

        {/* bottom wave SVG */}
        <Box
          component="svg"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 120,
          }}
        >
          <path
            d="M0,40 C360,120 1080,0 1440,80 L1440,120 L0,120 Z"
            fill={theme.palette.background.paper}
          />
        </Box>
      </Box>
    </>
  );
};

export default LandingPage;