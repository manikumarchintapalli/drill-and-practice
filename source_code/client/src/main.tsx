// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { QueryClientProvider } from "@tanstack/react-query";
// import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

// import App from "./App.jsx";
// import { queryClient } from "./api/http.js";
// import "./index.css"; // keep your global styles if needed


// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <QueryClientProvider client={queryClient}>
        
//           <CssBaseline />
//           <App />
      
//       </QueryClientProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );
// src/main.tsx
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, CssBaseline } from "@mui/material";

import { queryClient } from "./api/http";  // http.ts
                  // App.tsx
import { theme } from "./lib/theme";       // theme.tsx
import "./index.css";
import { Toaster } from "react-hot-toast";
import App from "./App";

// 1. Locate the root container
const container = document.getElementById("root");
if (!container) {
  throw new Error("Could not find #root element in the DOM");
}

// 2. Create the React root with a guaranteed non-null Element
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Toaster />
          <App/>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);