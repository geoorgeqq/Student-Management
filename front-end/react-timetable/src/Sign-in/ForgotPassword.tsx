import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useNavigate } from "react-router-dom";

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({
  open,
  handleClose,
}: ForgotPasswordProps) {
  const [email, setEmail] = React.useState("");
  const navigate = useNavigate();

  // Function to send the POST request for password reset
  const handleResetPassword = async () => {
    try {
      // Since the backend expects the email in the URL (as a @RequestParam)
      const response = await fetch(
        `http://localhost:8080/student/forgot-password?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "POST", // This can be 'GET' if your backend expects a GET request with query params
        }
      );

      if (response.ok) {
        // Handle success (e.g., show a success message)
        console.log("Password reset email sent!");
      } else {
        // Handle failure (e.g., show an error message)
        console.error("Failed to send password reset email.");
      }
    } catch (error) {
      console.error(
        "An error occurred while sending the password reset request:",
        error
      );
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleResetPassword(); // Call the password reset function on submit
          handleClose();
        },
      }}
    >
      <DialogTitle>Reset password</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          Enter your account&apos;s email address, and we&apos;ll send you a
          link to reset your password.
        </DialogContentText>
        <OutlinedInput
          autoFocus
          required
          margin="dense"
          id="email"
          name="email"
          label="Email address"
          placeholder="Email address"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update the email state on input change
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" type="submit">
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}
