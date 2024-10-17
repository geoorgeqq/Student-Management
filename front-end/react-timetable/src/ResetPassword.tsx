import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  createTheme,
  PaletteMode,
  ThemeProvider,
  CssBaseline,
  Snackbar,
} from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import { useNavigate, useSearchParams } from "react-router-dom";
import TemplateFrame from "./sign-up/TemplateFrame";
import getSignUpTheme from "./sign-up/getSignUpTheme";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";

// Styled components
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  fontFamily: "Roboto, sans-serif",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "100%",
  padding: 4,
  backgroundImage:
    "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
  backgroundRepeat: "no-repeat",
  fontFamily: "Roboto, sans-serif", // Add the font here
  ...theme.applyStyles("dark", {
    backgroundImage:
      "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
  }),
}));

// Custom alert component
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const navigate = useNavigate();
  const [mode, setMode] = useState<PaletteMode>("dark");
  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode); // Save the selected mode to localStorage
  };

  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/student/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      if (response.ok) {
        setSnackbarMessage("Your password has been reset successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
        setTimeout(() => navigate("/student/login"), 3000);
      } else {
        setSnackbarMessage("Failed to reset password.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setSnackbarMessage("An error occurred.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const SignUpTheme = createTheme(getSignUpTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  return (
    <TemplateFrame
      toggleCustomTheme={toggleCustomTheme}
      showCustomTheme={true}
      mode={mode}
      toggleColorMode={toggleColorMode}
    >
      <ThemeProvider theme={SignUpTheme}>
        <CssBaseline enableColorScheme />
        <SignInContainer justifyContent="center">
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{
                textAlign: "center",
                width: "100%",
                fontSize: "clamp(2rem, 10vw, 2.15rem)",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              Reset Password
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={(e) => e.preventDefault()}
            >
              <TextField
                required
                margin="dense"
                id="newPassword"
                name="newPassword"
                label="New Password"
                placeholder="New Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                required
                margin="dense"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {errorMessage && (
                <Typography color="error">{errorMessage}</Typography>
              )}
              <Button
                fullWidth
                variant="contained"
                onClick={handleResetPassword}
                sx={{ marginTop: 2 }}
              >
                Reset Password
              </Button>
            </Box>
          </Card>
        </SignInContainer>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
        </Snackbar>
      </ThemeProvider>
    </TemplateFrame>
  );
}
