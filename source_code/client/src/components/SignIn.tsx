import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Link as MuiLink,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { useSignInService, useAdminSignInService } from "../api/apiServices";
import { getAuthenticatedUser, loginUser } from "../lib/authUtils";
import TopNav from "./topNav";

type AuthResponse = {
  token: string;
  role?: string;
  [key: string]: any;
};

const SignIn: React.FC = () => {
  const user = getAuthenticatedUser();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    mutate: signInUser,
    isPending: userPending,
    error: userError,
    isError: isUserError,
  } = useSignInService();

  const {
    mutate: signInAdmin,
    isPending: adminPending,
    error: adminError,
    isError: isAdminError,
  } = useAdminSignInService();

  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const onSuccess = (data: AuthResponse) => {
      loginUser(data.token);
    };
    if (isAdmin) {
      signInAdmin(formData, { onSuccess });
    } else {
      signInUser(formData, { onSuccess });
    }
  };

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin/question-manager" : "/home"} replace />;
  }

  const getErrorMessage = () => {
    const fallback = isAdmin
      ? "Admin login failed. Please check your credentials."
      : "User login failed. Please try again.";
    const err = isAdmin ? adminError : userError;
    const msg = (err as any)?.response?.data;
    if (typeof msg === "string") return msg;
    if (msg?.message) return msg.message;
    return fallback;
  };

  return (
    <>
      <TopNav />
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "calc(100vh - 80px)", // adjusted height without adding background
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
            boxShadow: "0px 8px 24px rgba(0,0,0,0.1)", // smooth shadow
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

          {(isUserError || isAdminError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {getErrorMessage()}
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
              type="password"
              value={formData.password}
              onChange={handleInput}
              fullWidth
              autoComplete="current-password"
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={userPending || adminPending}
              sx={{
                backgroundColor: "#5b21b6", // purple
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
              onClick={() => setIsAdmin((prev) => !prev)}
              sx={{
                textAlign: "center",
                color: "#5b21b6",
                mt: 1,
                fontWeight: "medium",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {isAdmin ? "Login as User instead?" : "Login as Admin instead?"}
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