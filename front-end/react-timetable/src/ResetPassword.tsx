import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get the token from URL query params
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false); // Snackbar state
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  ); // Snackbar severity

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
          body: JSON.stringify({
            token, // Send token and new password to backend
            newPassword,
          }),
        }
      );

      if (response.ok) {
        // Handle success: show Snackbar message
        setSnackbarMessage("Your password has been reset successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true); // Open Snackbar
        // Optionally, redirect the user to the login page
        // window.location.href = '/login'; // Uncomment to redirect to login page
      } else {
        // Handle failure (e.g., show an error message)
        setSnackbarMessage("Failed to reset password. Please try again.");
        setSnackbarSeverity("error");
        setOpenSnackbar(true); // Open Snackbar
        setErrorMessage("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setSnackbarMessage("An error occurred while resetting the password.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true); // Open Snackbar
      setErrorMessage("An error occurred while resetting the password.");
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
      <Dialog open>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "100%",
          }}
        >
          <DialogContentText>
            Please enter your new password below.
          </DialogContentText>

          <OutlinedInput
            required
            margin="dense"
            id="newPassword"
            name="newPassword"
            label="New Password"
            placeholder="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <OutlinedInput
            required
            margin="dense"
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {errorMessage && (
            <DialogContentText color="error">{errorMessage}</DialogContentText>
          )}
        </DialogContent>

        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button variant="contained" onClick={handleResetPassword}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
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
    </>
  );
}
