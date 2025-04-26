import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
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

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

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

  if (user) return <Navigate to="/" replace />;

  return (
    <>
      <TopNav />
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f6f7fb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 6, sm: 10 }, // <-- padding top for breathing room!
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
                type="password"
                value={formData.password}
                onChange={handleInput}
                fullWidth
              />
              <TextField
                required
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInput}
                fullWidth
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
                  "&:hover": {
                    backgroundColor: "#4c1d95",
                  },
                }}
              >
                {isPending ? (
                  <>
                    Signing Up...{" "}
                    <CircularProgress size={20} sx={{ ml: 1, color: "white" }} />
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