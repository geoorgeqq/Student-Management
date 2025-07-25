import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import {
  createTheme,
  PaletteMode,
  styled,
  ThemeProvider, // Ensure this is imported
} from "@mui/material/styles";
import ForgotPassword from "./ForgotPassword";
import getSignUpTheme from "./../sign-up/theme/getSignUpTheme";
import TemplateFrame from "../sign-up/TemplateFrame";
import axios from "axios";
import { Router, useParams } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { InputAdornment, IconButton } from "@mui/material";
import { setAuthenticationHeader } from "../dashboard/components/Authenticate";

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

export default function SignIn(props: { disableCustomTheme?: boolean }) {
  enum UserType {
    STUDENT = "student",
    TEACHER = "teacher",
    ADMIN = "admin",
  }
  const { type } = useParams<{ type: string }>();
  const userType = type as UserType;
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);

  const [isChecked, setIsChecked] = React.useState<boolean>(false);

  const handleCheckboxChange = (
    _event: React.SyntheticEvent,
    checked: boolean
  ) => {
    setIsChecked(checked);
    console.log(checked);
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  interface User {
    email: string;
    password: string;
    isChecked: boolean;
  }

  interface UserData {
    name: string;
    email: string;
    id: number;
    pic: string;
    department?: { id: number; name: string };
  }

  interface ResponseJWT {
    jwtToken: string;
    student?: UserData;
    teacher?: UserData;
    admin?: UserData;
  }

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const [mode, setMode] = React.useState<PaletteMode>("dark");
  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode); // Save the selected mode to localStorage
  };

  const defaultTheme = createTheme({ palette: { mode } });
  const SignUpTheme = createTheme(getSignUpTheme(mode));
  const [formData, setFormData] = React.useState<User>({
    email: "",
    password: "",
    isChecked: isChecked,
  });
  const [emailError, setEmailError] = React.useState(false);
  const [departments, setDepartments] = React.useState([]);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Prepare JSON data
    const loginData = {
      email: formData.email,
      password: formData.password,
      isChecked: isChecked,
    };

    console.log("Sending data to backend:", loginData);

    try {
      const response = await axios.post(
        `http://localhost:8080/${type}/login`,
        loginData, // Send as JSON
        {
          headers: {
            "Content-Type": "application/json", // Ensure it's sent as JSON
            "X-Requested-With": "XMLHttpRequest", // Add this header for AJAX requests
          },
        }
      );
      const responseJWT = response.data;
      localStorage.setItem("jsonWebToken", responseJWT.jwtToken);

      const userData = responseJWT[userType as keyof ResponseJWT] as
        | UserData
        | undefined;
      console.log(userData);

      // Destructure response data
      if (userData) {
        const { name, email, id, pic, department } = userData;
        const departmentId = department?.id;
        const imageUrl = `data:image/jpeg;base64,${pic}`;
        // Navigate to dashboard
        navigate(`/${type}/dashboard`, {
          state: { name, email, id, image: imageUrl, departmentId },
        });
      }
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  return (
    <TemplateFrame
      toggleCustomTheme={toggleCustomTheme}
      showCustomTheme={showCustomTheme}
      mode={mode}
      toggleColorMode={toggleColorMode}
      showBackArrow={true}
    >
      <ThemeProvider theme={showCustomTheme ? SignUpTheme : defaultTheme}>
        <CssBaseline enableColorScheme />
        <SignInContainer
          direction="column"
          justifyContent="space-between"
          sx={{ fontFamily: "Roboto, Arial, sans-serif" }} // Apply font here
        >
          <Card variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{
                textAlign: "center",
                width: "100%",
                fontSize: "clamp(2rem, 10vw, 2.15rem)",
                fontFamily: "Roboto, Arial, sans-serif",
              }}
            >
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
                fontFamily: "Roboto, Arial, sans-serif",
              }}
            >
              <FormControl sx={{ fontFamily: "Roboto, Arial, sans-serif" }}>
                <FormLabel
                  htmlFor="email"
                  sx={{ fontFamily: "Roboto, Arial, sans-serif" }}
                >
                  Email
                </FormLabel>
                <TextField
                  error={emailError}
                  helperText={emailErrorMessage}
                  id="email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={emailError ? "error" : "primary"}
                  onChange={handleChange}
                  sx={{
                    "& .MuiInputBase-input": {
                      fontFamily: "Roboto, sans-serif", // Change font family for input text
                      fontSize: "1rem", // You can adjust the font size if needed
                    },
                  }}
                />
              </FormControl>
              <FormControl sx={{ fontFamily: "Roboto, Arial, sans-serif" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "Roboto, Arial, sans-serif",
                  }}
                >
                  <FormLabel
                    htmlFor="password"
                    sx={{ fontFamily: "Roboto, Arial, sans-serif" }}
                  >
                    Password
                  </FormLabel>
                  <Link
                    component="button"
                    onClick={handleClickOpen}
                    variant="body2"
                    sx={{
                      alignSelf: "baseline",
                      fontFamily: "Roboto, Arial, sans-serif",
                    }}
                  >
                    Forgot your password?
                  </Link>
                </Box>
                <TextField
                  error={passwordError}
                  helperText={passwordErrorMessage}
                  name="password"
                  placeholder="•••••••"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  color={passwordError ? "error" : "primary"}
                  sx={{ fontFamily: "Roboto, Arial, sans-serif" }}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ position: "relative" }}
                      >
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          sx={{
                            position: "absolute",
                            right: 0, // Align to the right side of the TextField
                            padding: 0, // Remove padding
                            backgroundColor: "transparent", // No background
                            border: "none", // Remove border
                            outline: "none", // Remove outline
                            background: "none",
                            height: "0px",
                            "&:hover": {
                              backgroundColor: "transparent", // Ensure no background on hover
                            },
                            "&:focus": {
                              outline: "none", // Remove outline on focus
                              backgroundColor: "transparent", // No background on focus
                            },
                            "&:active": {
                              outline: "none", // Remove outline on active
                              backgroundColor: "transparent", // No background on active
                            },
                          }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    // Target the label specifically
                    fontFamily: "Roboto, sans-serif",
                  },
                }}
                checked={isChecked}
                onChange={handleCheckboxChange}
              />

              <ForgotPassword open={open} handleClose={handleClose} />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={validateInputs}
                sx={{ fontFamily: "Roboto, Arial, sans-serif" }}
              >
                Sign in
              </Button>
              {/* Only show sign up link for students */}
              {userType === UserType.STUDENT && (
              <Typography
                sx={{
                  textAlign: "center",
                  fontFamily: "Roboto, Arial, sans-serif",
                }}
              >
                Don&apos;t have an account?{" "}
                <span>
                  <Link
                    href="/student/register"
                    variant="body2"
                    sx={{
                      alignSelf: "center",
                      fontWeight: 500,
                      fontFamily: "Roboto, Arial, sans-serif",
                    }}
                  >
                    Sign up
                  </Link>
                </span>
              </Typography>
              )}
            </Box>
          </Card>
        </SignInContainer>
      </ThemeProvider>
    </TemplateFrame>
  );
}
function base64ToBlob(base64: any, arg1: string) {
  throw new Error("Function not implemented.");
}
