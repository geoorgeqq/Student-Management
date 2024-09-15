import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage } from "./HomePage/HomePage";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import SignIn from "./Sign-in/SignIn";
import SignUp from "./sign-up/SignUp";

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
        <Route path="/login/:type" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </Router>
  );
};
