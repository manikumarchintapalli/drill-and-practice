// src/pages/SignUp.tsx
import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, Navigate } from "react-router-dom";
import { useSignUpService } from "../api/apiServices";
import { getAuthenticatedUser, loginUser } from "../lib/authUtils";
import TopNav from "./topNav";

interface FormData {
  username: string;
  dob: string;
  phoneNo: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "user" | "admin";
}

const SignUp: React.FC = () => {
  const user = getAuthenticatedUser();
  const { mutate: signUp, isPending, error, isError } = useSignUpService();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<FormData>({
    username: "",
    dob: "",
    phoneNo: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  // visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // validation error
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password" || name === "confirmPassword") {
      setPasswordError(null);
    }
  };

  const handleSubmit = () => {
    // 1. passwords match?
    if (formData.password !== formData.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    // 2. at least 8 chars + one special symbol
    const pwdRegex = /^(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!pwdRegex.test(formData.password)) {
      setPasswordError(
        "Password must be ≥8 characters and include at least one special symbol"
      );
      return;
    }
    // 3. all good → sign up
    signUp(formData, {
      onSuccess: (data) => {
        if (!data.token || data.token.split(".").length !== 3) {
          alert("Invalid token received");
          return;
        }
        loginUser(data.token);
      },
      onError: (err) => {
        console.error("Signup error:", err);
      },
    });
  };

  // auto-hide after 3s
  useEffect(() => {
    if (!showPassword) return;
    const t = setTimeout(() => setShowPassword(false), 3000);
    return () => clearTimeout(t);
  }, [showPassword]);

  useEffect(() => {
    if (!showConfirm) return;
    const t = setTimeout(() => setShowConfirm(false), 3000);
    return () => clearTimeout(t);
  }, [showConfirm]);

  if (user) return <Navigate to="/" replace />;

  return (
    <>
      <TopNav />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f6f7fb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 6, sm: 10 },
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              bgcolor: "background.paper",
              p: { xs: 3, sm: 4 },
              borderRadius: 4,
              boxShadow: "0px 8px 30px rgba(0,0,0,0.1)",
              width: "100%",
              maxWidth: 500,
              mx: "auto",
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight="bold"
              mb={3}
              textAlign="center"
            >
              Create an Account
            </Typography>

            {isError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {(error as any)?.response?.data || "An error occurred"}
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
                name="username"
                label="Username"
                value={formData.username}
                onChange={handleInput}
                autoComplete="username"
                fullWidth
              />

              <TextField
                required
                name="dob"
                label="Date of Birth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.dob}
                onChange={handleInput}
                fullWidth
              />

              <TextField
                required
                name="phoneNo"
                label="Phone Number"
                type="tel"
                value={formData.phoneNo}
                onChange={handleInput}
                fullWidth
              />

              <TextField
                required
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInput}
                fullWidth
              />

              <TextField
                required
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInput}
                error={!!passwordError}
                helperText={passwordError}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                required
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInput}
                error={!!passwordError}
                helperText={passwordError}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label={
                          showConfirm ? "Hide password" : "Show password"
                        }
                      >
                        {showConfirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.role === "admin"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        role: e.target.checked ? "admin" : "user",
                      }))
                    }
                  />
                }
                label="Register as Admin"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isPending}
                sx={{
                  backgroundColor: "#5b21b6",
                  fontWeight: "bold",
                  py: 1.5,
                  "&:hover": { backgroundColor: "#4c1d95" },
                }}
              >
                {isPending ? (
                  <>
                    Signing Up…{" "}
                    <CircularProgress
                      size={20}
                      sx={{ ml: 1, color: "white" }}
                    />
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>

              <Typography
                variant="body2"
                textAlign="center"
                sx={{ mt: 2, color: "text.secondary" }}
              >
                Already have an account?{" "}
                <Link
                  to="/sign-in"
                  style={{ color: "#5b21b6", fontWeight: 500 }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default SignUp;