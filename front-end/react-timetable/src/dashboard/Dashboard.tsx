import * as React from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AppNavbar from "./components/AppNavbar";
import SideMenu from "./components/SideMenu";
import AppTheme from "../shared-theme/AppTheme";
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from "./theme/customizations";
import {
  Navigate,
  replace,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ContentRenderer from "./components/ContentRenderer";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const theme = createTheme({
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      @font-face {
        font-family: 'Roboto';
        font-style: normal;
        font-display: swap;
        font-weight: 400;
      }`,
    },
  },
});

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  const location = useLocation();
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  if (typeof type !== "undefined") {
    localStorage.setItem("role", type);
  }

  const [name, setName] = React.useState<string>(location.state?.name || "");
  const [email, setEmail] = React.useState<string>(location.state?.email || "");
  const [image, setImage] = React.useState<string>(location.state?.image || "");
  const [id, setId] = React.useState<string>(location.state?.id || "");
  const [departmentId, setDepartmentId] = React.useState<string>(
    location.state?.departmentId || ""
  );
  const jwtToken = localStorage.getItem("jsonWebToken");

  const [selectedContent, setSelectedContent] = React.useState<string>("Home");
  const [students, setStudents] = React.useState<[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // State to manage the popup dialog visibility
  const [sessionExpired, setSessionExpired] = React.useState<boolean>(false);

  React.useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("jsonWebToken");
          setSessionExpired(true); // Show the popup
          // Delay navigation by 2 seconds
          setTimeout(() => {
            navigate(`/${type}/login`, { replace: true });
          }, 2000);
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  React.useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/student`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleMenuClick = (content: string) => {
    setSelectedContent(content);
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        <SideMenu
          userType={type}
          name={name}
          email={email}
          image={image}
          onMenuClick={handleMenuClick}
          selectedContent={selectedContent}
        />
        <AppNavbar />
        <ContentRenderer
          userType={type}
          selectedContent={selectedContent}
          students={students}
          loading={loading}
          error={error}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          image={image}
          setImage={setImage}
          id={id}
          setId={setId}
          departmentId={departmentId}
          setDepartmentId={setDepartmentId}
        />
      </Box>

      {/* Session Expired Popup */}
      <Dialog open={sessionExpired} onClose={() => setSessionExpired(false)}>
        <DialogTitle>Session Expired</DialogTitle>
        <DialogContent>
          Your session has expired. You will be redirected to the login page.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSessionExpired(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </AppTheme>
  );
}
