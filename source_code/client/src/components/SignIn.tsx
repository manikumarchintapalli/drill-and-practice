
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, Navigate } from "react-router-dom";
import { useSignInService, useAdminSignInService } from "../api/apiServices";
import { getAuthenticatedUser, loginUser } from "../lib/authUtils";
import TopNav from "./topNav";

type AuthResponse = { token: string; role?: string; [key: string]: any };

const SignIn: React.FC = () => {
  const user = getAuthenticatedUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // local state for form
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  
  useEffect(() => {
    if (!showPassword) return;
    const t = setTimeout(() => setShowPassword(false), 3000);
    return () => clearTimeout(t);
  }, [showPassword]);

  const {
    mutate: signInUser,
    isPending: userPending,
  } = useSignInService();
  const {
    mutate: signInAdmin,
    isPending: adminPending,
  } = useAdminSignInService();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    setLoginError(null);

    const onSuccess = (data: AuthResponse) => {
      loginUser(data.token);
    };

    const onError = (err: any) => {
   
      const msg =
        err?.response?.data ||
        "Login failed. Please check your credentials.";
      setLoginError(typeof msg === "string" ? msg : JSON.stringify(msg));
    };

    if (isAdmin) {
      signInAdmin(formData, { onSuccess, onError });
    } else {
      signInUser(formData, { onSuccess, onError });
    }
  };

  if (user) {
    // already logged in: redirect
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/question-manager" : "/home"}
        replace
      />
    );
  }

  return (
    <>
      <TopNav />
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: 500,
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight="bold"
            textAlign="center"
            mb={3}
          >
            {isAdmin ? "Admin Login" : "User Login"}
          </Typography>

          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}

          <Box
            component="form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            display="flex"
            flexDirection="column"
            gap={2.5}
          >
            <TextField
              required
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInput}
              fullWidth
              autoComplete="email"
              variant="outlined"
            />

            <TextField
              required
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInput}
              fullWidth
              autoComplete="current-password"
              variant="outlined"
              // endAdornment handled via InputProps
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={userPending || adminPending}
              sx={{
                backgroundColor: "#5b21b6",
                color: "#fff",
                fontWeight: "bold",
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#4c1d95",
                },
              }}
            >
              {userPending || adminPending ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "LOGIN"
              )}
            </Button>

            <MuiLink
              component="button"
              variant="body2"
              onClick={() => {
                setIsAdmin((prev) => !prev);
                setLoginError(null);
              }}
              sx={{
                textAlign: "center",
                color: "#5b21b6",
                mt: 1,
                fontWeight: "medium",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {isAdmin
                ? "Login as User instead?"
                : "Login as Admin instead?"}
            </MuiLink>

            {!isAdmin && (
              <MuiLink
                component={Link}
                to="/sign-up"
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: "text.secondary",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Don’t have an account?
              </MuiLink>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default SignIn;