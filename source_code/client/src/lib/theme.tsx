import { createTheme } from "@mui/material/styles";

export const HIGHLIGHTS_COLOR  = "#eead0e";
export const BACKGROUND_COLOR  = "#f4f1e8";
export const PRIMARY_COLOR     = "#6A0DAD";
export const SECONDARY_COLOR   = "#4B0082";
export const SCROLLBAR_THUMB   = "#6b6b6b";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary:   { main: PRIMARY_COLOR },
    secondary: { main: SECONDARY_COLOR },
    background:{
      default: BACKGROUND_COLOR,
      paper:   "#fff"
    },
    text: {
      primary: "#333",
      secondary: "#333"
    },
  },
  typography: {
    fontFamily: "Playfair Display Variable, serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: `${SCROLLBAR_THUMB} ${BACKGROUND_COLOR}`,
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: BACKGROUND_COLOR,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          },
        },
      },
    },
  },
});