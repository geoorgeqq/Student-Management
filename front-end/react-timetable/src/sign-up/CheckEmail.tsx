import React, { useEffect } from "react";
import { Typography, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CheckEmail: React.FC = () => {
  const navigate = useNavigate();

  // Redirect to the login page after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {}, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // Clean up the timeout on unmount
  }, [navigate]);

  return (
    <Stack
      sx={{
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h4">Check Your Email!</Typography>
      <Typography variant="body1">
        A verification email has been sent to your inbox. Please check your
        email to verify your account.
      </Typography>
      <Typography variant="body2">
        You will be redirected to the login page shortly.
      </Typography>
    </Stack>
  );
};

export default CheckEmail;
