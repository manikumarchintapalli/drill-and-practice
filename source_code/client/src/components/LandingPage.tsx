// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   Box,
//   Typography,
//   Button,
//   Grid,
//   Stack,
//   Container,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { motion } from "framer-motion";
// import TopNav from "./TopNav";

// const LandingPage = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   return (
//     <>
//       <TopNav />

//       <Box
//         sx={{
//           minHeight: "100vh",
//           background: "linear-gradient(to bottom right, #2e0854, #4B0082)",
//           color: "white",
//           display: "flex",
//           alignItems: "center",
//           px: 2,
//           py: { xs: 6, md: 8 },
//         }}
//       >
//         <Container maxWidth="xl">
//           <Grid
//             container
//             spacing={4}
//             alignItems="center"
//             justifyContent="space-between"
//             direction={isMobile ? "column-reverse" : "row"}
//           >
//             {/* Left: Terminal & Dashboard Visuals */}
//             <Grid item xs={12} md={7}>
//               <motion.div
//                 initial={{ opacity: 0, x: -30 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     flexDirection: { xs: "column", sm: "row" },
//                     alignItems: "center",
//                     justifyContent: "center",
//                     gap: 3,
//                     flexWrap: "wrap",
//                   }}
//                 >
//                   {/* Terminal Card */}
//                   <Box
//                     sx={{
//                       backgroundColor: "#fff",
//                       borderRadius: 4,
//                       width: { xs: 240, sm: 280 },
//                       height: { xs: 160, sm: 180 },
//                       p: 2,
//                       boxShadow: 4,
//                     }}
//                   >
//                     <Stack direction="row" spacing={1} mb={2}>
//                       <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#FFD700" }} />
//                       <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#FF8C00" }} />
//                       <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#8A2BE2" }} />
//                     </Stack>
//                     <Stack spacing={1}>
//                       {Array.from({ length: 4 }).map((_, i) => (
//                         <Box key={i} display="flex" alignItems="center" gap={1}>
//                           <Box
//                             sx={{
//                               width: 8,
//                               height: 8,
//                               borderRadius: "50%",
//                               bgcolor: i % 2 === 0 ? "#6A0DAD" : "#FFD700",
//                             }}
//                           />
//                           <Box
//                             sx={{
//                               height: 6,
//                               width: "70%",
//                               bgcolor: "#ddd",
//                               borderRadius: 1,
//                             }}
//                           />
//                         </Box>
//                       ))}
//                     </Stack>
//                   </Box>

//                   {/* Tilted Dashboard */}
//                   <Box
//                     sx={{
//                       width: { xs: 260, sm: 320 },
//                       backgroundColor: "#fff",
//                       borderRadius: 4,
//                       transform: "rotate(-4deg)",
//                       boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
//                       p: 2,
//                     }}
//                   >
//                     <Grid container spacing={1} mb={1}>
//                       {["#90CAF9", "#A5D6A7", "#FFD54F", "#EF9A9A"].map((color, idx) => (
//                         <Grid item xs={3} key={idx}>
//                           <Box sx={{ height: 28, bgcolor: color, borderRadius: 1 }} />
//                         </Grid>
//                       ))}
//                     </Grid>
//                     <Stack spacing={1}>
//                       {Array.from({ length: 4 }).map((_, i) => (
//                         <Box
//                           key={i}
//                           display="flex"
//                           justifyContent="space-between"
//                           alignItems="center"
//                           sx={{
//                             bgcolor: "#f9f9f9",
//                             px: 2,
//                             py: 0.8,
//                             borderRadius: 1,
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               width: "70%",
//                               height: 6,
//                               bgcolor: "#ddd",
//                               borderRadius: 1,
//                             }}
//                           />
//                           <Box
//                             sx={{
//                               width: 8,
//                               height: 8,
//                               borderRadius: "50%",
//                               bgcolor: ["#66BB6A", "#EF5350", "#FFB300"][i % 3],
//                             }}
//                           />
//                         </Box>
//                       ))}
//                     </Stack>
//                   </Box>
//                 </Box>
//               </motion.div>
//             </Grid>

//             {/* Right: Hero text & CTA */}
//             <Grid item xs={12} md={5}>
//               <motion.div
//                 initial={{ opacity: 0, x: 30 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <Typography
//                   variant="h3"
//                   fontWeight="bold"
//                   gutterBottom
//                   sx={{
//                     color: "#FFD700",
//                     fontSize: { xs: "1.8rem", sm: "2.4rem", md: "2.8rem" },
//                     lineHeight: 1.3,
//                   }}
//                 >
//                   A Smarter Way to <span style={{ color: "#fff" }}>Practice</span>
//                 </Typography>

//                 <Typography
//                   variant="body1"
//                   sx={{
//                     color: "#E0E0E0",
//                     mb: 4,
//                     fontSize: { xs: "0.95rem", sm: "1rem" },
//                     maxWidth: 400,
//                   }}
//                 >
//                   KUMBHAMELA helps you learn faster with hands-on practice, curated questions, and beautiful interactive design.
//                 </Typography>

//                 <Button
//                   variant="contained"
//                   size="large"
//                   component={Link}
//                   to="/sign-up"
//                   sx={{
//                     backgroundColor: "#FFD700",
//                     color: "#4B0082",
//                     fontWeight: 700,
//                     px: 4,
//                     py: 1.5,
//                     borderRadius: "50px",
//                     textTransform: "none",
//                     fontSize: "1rem",
//                     "&:hover": {
//                       backgroundColor: "#FFC300",
//                     },
//                   }}
//                 >
//                   Create Account
//                 </Button>
//               </motion.div>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>
//     </>
//   );
// };

// export default LandingPage;
import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import TopNav from "./topNav";
import { HIGHLIGHTS_COLOR } from "../lib/theme";

const LandingPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const terminalDots = [
    HIGHLIGHTS_COLOR,
    theme.palette.warning.dark,
    theme.palette.secondary.light,
  ];

  const statusColors = [
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
  ];

  return (
    <>
      <TopNav />

      <Box
        sx={{
          minHeight: "100vh",
          background: `linear-gradient(to bottom right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
          color: theme.palette.common.white,
          display: "flex",
          alignItems: "center",
          px: 2,
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column-reverse" : "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            {/* Left Side: Mockups */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{ flex: 1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                  justifyContent: "center",
                  gap: theme.spacing(3),
                  flexWrap: "wrap",
                }}
              >
                {/* Terminal Mockup */}
                <Box
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius * 2,
                    width: { xs: 240, sm: 280 },
                    height: { xs: 160, sm: 180 },
                    p: 2,
                    boxShadow: 4,
                  }}
                >
                  <Stack direction="row" spacing={1} mb={2}>
                    {terminalDots.map((dot, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: "50%",
                          bgcolor: dot,
                        }}
                      />
                    ))}
                  </Stack>

                  <Stack spacing={1}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Box
                        key={i}
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor:
                              i % 2 === 0
                                ? theme.palette.primary.main
                                : HIGHLIGHTS_COLOR,
                          }}
                        />
                        <Box
                          sx={{
                            height: 6,
                            width: "70%",
                            bgcolor: theme.palette.grey[300],
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>

                {/* Dashboard Mockup */}
                <Box
                  sx={{
                    width: { xs: 260, sm: 320 },
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: theme.shape.borderRadius * 2,
                    transform: "rotate(-4deg)",
                    boxShadow: theme.shadows[8],
                    p: 2,
                  }}
                >
                  <Box display="flex" gap={1} mb={1}>
                    {[
                      theme.palette.info.light,
                      theme.palette.success.light,
                      theme.palette.warning.light,
                      theme.palette.error.light,
                    ].map((color, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          height: 28,
                          flex: 1,
                          bgcolor: color,
                          borderRadius: 1,
                        }}
                      />
                    ))}
                  </Box>

                  <Stack spacing={1}>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Box
                        key={i}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          bgcolor: theme.palette.grey[100],
                          px: 2,
                          py: 0.8,
                          borderRadius: theme.shape.borderRadius,
                        }}
                      >
                        <Box
                          sx={{
                            width: "70%",
                            height: 6,
                            bgcolor: theme.palette.grey[300],
                            borderRadius: 1,
                          }}
                        />
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: statusColors[i % statusColors.length],
                          }}
                        />
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </motion.div>

            {/* Right Side: CTA */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              style={{ flex: 1 }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{
                  color: HIGHLIGHTS_COLOR,
                  fontSize: { xs: "1.8rem", sm: "2.4rem", md: "2.8rem" },
                  lineHeight: 1.3,
                }}
              >
                A Smarter Way to{" "}
                <Box component="span" color="common.white">
                  Practice
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.grey[300],
                  mb: 4,
                  fontSize: { xs: "0.95rem", sm: "1rem" },
                  maxWidth: 400,
                }}
              >
                KUMBHAMELA helps you learn faster with hands-on practice,
                curated questions, and beautiful interactive design.
              </Typography>

              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/sign-up"
                sx={{
                  backgroundColor: HIGHLIGHTS_COLOR,
                  color: theme.palette.secondary.main,
                  fontWeight: 700,
                  px: 4,
                  py: 1.5,
                  borderRadius: "50px",
                  textTransform: "none",
                  fontSize: "1rem",
                  "&:hover": {
                    backgroundColor: theme.palette.warning.dark,
                  },
                }}
              >
                Create Account
              </Button>
            </motion.div>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LandingPage;