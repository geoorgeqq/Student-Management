import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "./HomePage/HomePage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SignIn from "./Sign-in/SignIn";
import SignUp from "./sign-up/SignUp";
import "@fontsource/roboto";
import Dashboard from "./dashboard/Dashboard";
import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";
import CheckEmail from "./sign-up/CheckEmail";

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export const App = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleLogin = (email: string, password: string, type: string) => {
    console.log(`${type} logged in with email: ${email}`);
    // Handle actual login logic
    setLoggedIn(true);
    setEmail(email);
  };

  const handleLoginLogout = () => {
    if (loggedIn) {
      setLoggedIn(false); // Log out the user
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                loggedIn={loggedIn}
                email={email}
                handleLoginLogout={handleLoginLogout}
              />
            }
          />
          <Route path="/check-email" element={<CheckEmail />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path=":type/login" element={<SignIn />} />
          <Route path="/student/register" element={<SignUp />} />
          <Route path=":type/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};
