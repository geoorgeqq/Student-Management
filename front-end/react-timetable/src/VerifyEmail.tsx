import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Snackbar, Typography, Box, Stack } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import TemplateFrame from "./sign-up/TemplateFrame";
import getSignUpTheme from "./sign-up/getSignUpTheme";

// Alert component for Snackbar
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get token from URL params
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  ); // Snackbar severity
  const navigate = useNavigate();
  const [showCustomTheme, setShowCustomTheme] = useState(true);
  const [mode, setMode] = useState<"dark" | "light">("dark");

  const toggleCustomTheme = () => setShowCustomTheme((prev) => !prev);

  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const defaultTheme = createTheme({ palette: { mode } });
  const SignUpTheme = createTheme(getSignUpTheme(mode));

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/student/verify-email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }), // Send token to backend
          }
        );

        if (response.ok) {
          setSnackbarMessage("Your email has been verified successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          setTimeout(() => navigate("/student/login"), 3500); // Redirect after a delay
        } else {
          setSnackbarMessage("Failed to verify email. Please try again.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarMessage("An error occurred during verification.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  return (
    <TemplateFrame
      toggleCustomTheme={toggleCustomTheme}
      showCustomTheme={showCustomTheme}
      mode={mode}
      toggleColorMode={toggleColorMode}
    >
      <ThemeProvider theme={showCustomTheme ? SignUpTheme : defaultTheme}>
        <CssBaseline enableColorScheme />
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100vh", fontFamily: "Roboto, Arial, sans-serif" }}
        >
          <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
              Email Verification
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please wait while we verify your email...
            </Typography>
          </Box>
          {/* Snackbar for notifications */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Stack>
      </ThemeProvider>
    </TemplateFrame>
  );
}
