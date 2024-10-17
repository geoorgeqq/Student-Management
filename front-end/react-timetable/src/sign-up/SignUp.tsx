import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs"; // Import Dayjs type from dayjs
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import {
  createTheme,
  ThemeProvider,
  styled,
  PaletteMode,
} from "@mui/material/styles";
import getSignUpTheme from "./theme/getSignUpTheme";
import { GoogleIcon, FacebookIcon, SitemarkIcon } from "./CustomIcons";
import TemplateFrame from "./TemplateFrame";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { VisibilityOff, Visibility } from "@mui/icons-material";

const today = dayjs();

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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

const SignUpContainer = styled(Stack)(({ theme }) => ({
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

const SignUp: React.FC = () => {
  interface User {
    id?: number;
    name: string;
    password: string;
    email: string;
    pic: File | null;
    department_id: string | number;
  }
  // Initialize the formData state with the User interface
  const [formData, setFormData] = React.useState<User>({
    name: "",
    email: "",
    password: "",
    pic: null,
    department_id: "",
  });
  const [departments, setDepartments] = React.useState<
    { id: number; department_name: string }[]
  >([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = React.useState<
    number | null
  >(null);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  React.useEffect(() => {
    fetch("http://localhost:8080/departments")
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleDepartmentChange = (event: SelectChangeEvent<number>) => {
    const departmentId = event.target.value as number; // Assuming departmentId is a number

    setSelectedDepartmentId(departmentId); // Update selectedDepartmentId

    // Update formData.department
    setFormData({
      ...formData,
      department_id: departmentId.toString(), // Ensure it's a string
    });

    console.log("Updated Department in formData:", departmentId.toString());
  };

  const [formDate, setFormDate] = React.useState<Date>();
  const [imageUrl, setImageUrl] = React.useState<string>("");

  const fileInputRef = React.useRef<HTMLInputElement | null>(null); // Create a ref for the file input

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]; // Get the first file
      setFormData({ ...formData, pic: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger the file input click
  const handleChooseFile = () => {
    fileInputRef.current?.click(); // Use ref to trigger the file input
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      setFormDate(newDate.toDate());
    }
  };
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSubmit = new FormData();
    dataToSubmit.append("name", formData.name);
    dataToSubmit.append("email", formData.email);
    dataToSubmit.append("password", formData.password);

    if (selectedDepartmentId) {
      dataToSubmit.append("department_id", selectedDepartmentId.toString());
    }

    if (formData.pic) {
      dataToSubmit.append("pic", formData.pic);
    }

    if (formDate) {
      dataToSubmit.append("dateOfBirth", dayjs(formDate).format("YYYY-MM-DD"));
    }

    try {
      const response = await axios.post<User>(
        "http://localhost:8080/student/register",
        dataToSubmit
      );

      const { name, email, pic, id } = response.data;
      const imageUrl = `data:image/jpeg;base64,${pic}`;
      const departmentId = selectedDepartmentId;

      setTimeout(() => {
        navigate("/check-email"); // Redirect to your custom "Check Your Email" page
      }, 3000); // Adjust timing if needed
    } catch (error) {
      console.log("Error registering user: " + error);
    }
  };

  const [mode, setMode] = React.useState<PaletteMode>("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const defaultTheme = createTheme({ palette: { mode } });
  const SignUpTheme = createTheme(getSignUpTheme(mode));
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState("");
  // This code only runs on the client side, to determine the system color preference
  React.useEffect(() => {
    // Check if there is a preferred mode in localStorage
    const savedMode = localStorage.getItem("themeMode") as PaletteMode | null;
    if (savedMode) {
      setMode(savedMode);
    } else {
      // If no preference is found, it uses system preference
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode); // Save the selected mode to localStorage
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  const validateInputs = () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;
    const name = document.getElementById("name") as HTMLInputElement;

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
    >
      <ThemeProvider theme={showCustomTheme ? SignUpTheme : defaultTheme}>
        <CssBaseline enableColorScheme />

        <SignUpContainer direction="column" justifyContent="space-between">
          <Stack
            sx={{
              justifyContent: "center",
              height: "100dvh",
              p: 2,
              fontFamily: "Roboto, sans-serif",
            }}
          >
            <Card variant="outlined">
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  textAlign: "center",
                  width: "100%",
                  fontSize: "clamp(2rem, 10vw, 2.15rem) ",
                  fontFamily: "Roboto, sans-serif",
                }}
              >
                Sign up
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                <FormControl>
                  <FormLabel
                    htmlFor="name"
                    sx={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                  >
                    Full Name
                  </FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    placeholder="Full name"
                    name="name"
                    autoComplete="name"
                    variant="outlined"
                    color={passwordError ? "error" : "primary"}
                    onChange={handleChange}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontFamily: "Roboto, sans-serif", // Change font family for input text
                        fontSize: "1rem", // You can adjust the font size if needed
                      },
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="email"
                    sx={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                  >
                    Email
                  </FormLabel>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    placeholder="your@email.com"
                    name="email"
                    autoComplete="email"
                    variant="outlined"
                    error={emailError}
                    helperText={emailErrorMessage}
                    color={passwordError ? "error" : "primary"}
                    onChange={handleChange}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontFamily: "Roboto, sans-serif", // Change font family for input text
                        fontSize: "1rem", // You can adjust the font size if needed
                      },
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="password"
                    sx={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                  >
                    Password
                  </FormLabel>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    placeholder="••••••"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="new-password"
                    variant="outlined"
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    color={passwordError ? "error" : "primary"}
                    onChange={handleChange}
                    sx={{
                      "& .MuiInputBase-input": {
                        fontFamily: "Roboto, sans-serif", // Change font family for input text
                        fontSize: "1rem", // Adjust the font size if needed
                      },
                      mb: 1, // Adjust margin-bottom for spacing below the password field
                    }}
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
                <FormControl>
                  <FormLabel
                    htmlFor="date-of-birth"
                    sx={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                  >
                    Date of birth
                  </FormLabel>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      orientation="landscape"
                      format="YYYY-MM-DD"
                      onChange={handleDateChange}
                      slotProps={{
                        textField: {
                          sx: {
                            fontFamily: "Roboto, sans-serif", // Apply the font family here
                            "& .MuiInputBase-input": {
                              fontFamily: "Roboto, sans-serif", // Ensure the input text also uses Roboto
                              fontSize: "1rem", // Optional: adjust the font size
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>
                <FormControl fullWidth>
                  <FormLabel htmlFor="department">Department</FormLabel>
                  <Select
                    value={
                      selectedDepartmentId !== null ? selectedDepartmentId : ""
                    } // Keep the value as a number or empty string
                    onChange={handleDepartmentChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Department" }}
                  >
                    <MenuItem value="" disabled>
                      Select a Department
                    </MenuItem>
                    {departments.map((department) => (
                      <MenuItem key={department.id} value={department.id}>
                        {department.department_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="profile-pic"
                    sx={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                  >
                    Profile Picture:
                  </FormLabel>
                  <Button
                    component="label"
                    id="profile-pic"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    onClick={handleChooseFile}
                    sx={{
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 500,
                      backgroundColor: "#42a5f5", // Change this to your desired color
                      "&:hover": {
                        backgroundColor: "#42a5f5", // Optional: Change color on hover
                      },
                    }}
                  >
                    Upload files
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handlePhotoChange}
                      multiple
                    />
                  </Button>
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={validateInputs}
                  sx={{ fontFamily: "Roboto, sans-serif", fontWeight: 500 }}
                >
                  Sign up
                </Button>
                <Typography
                  sx={{ textAlign: "center", fontFamily: "Roboto, sans-serif" }}
                >
                  Already have an account?{" "}
                  <span>
                    <Link
                      href="/material-ui/getting-started/templates/sign-in/"
                      variant="body2"
                      sx={{
                        alignSelf: "center",
                        fontFamily: "Roboto, sans-serif",
                      }}
                    >
                      Sign in
                    </Link>
                  </span>
                </Typography>
              </Box>
            </Card>
          </Stack>
          {/* Email Verification Dialog */}
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Email Verification</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Thank you for signing up! A verification link has been sent to
                your email. Please check your inbox to verify your account.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>OK</Button>
            </DialogActions>
          </Dialog>
        </SignUpContainer>
      </ThemeProvider>
    </TemplateFrame>
  );
};

export default SignUp;
