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
import { useLocation, useParams } from "react-router-dom";
import ContentRenderer from "./components/ContentRenderer";
import axios from "axios";

// Create theme with customizations
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

  // Create states for user-related data
  const [name, setName] = React.useState<string>(location.state?.name || "");
  const [email, setEmail] = React.useState<string>(location.state?.email || "");
  const [image, setImage] = React.useState<string>(location.state?.image || "");
  const [id, setId] = React.useState<string>(location.state?.id || "");
  const [departmentId, setDepartmentId] = React.useState<string>(
    location.state?.departmentId || ""
  );
  const jwtToken = localStorage.getItem("jsonWebToken");

  // State for managing selected content
  const [selectedContent, setSelectedContent] = React.useState<string>("Home");

  // State for managing students data, loading state, and error state
  const [students, setStudents] = React.useState<[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch students data when component mounts
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

  // Handle side menu item click
  const handleMenuClick = (content: string) => {
    setSelectedContent(content);
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex" }}>
        {/* Pass current states to SideMenu */}
        <SideMenu
          userType={type}
          name={name}
          email={email}
          image={image}
          onMenuClick={handleMenuClick}
          selectedContent={selectedContent}
        />
        <AppNavbar />
        {/* Main content */}
        <ContentRenderer
          userType={type}
          selectedContent={selectedContent}
          students={students}
          loading={loading}
          error={error}
          name={name}
          setName={setName} // Pass set state functions
          email={email}
          setEmail={setEmail} // Pass set state functions
          image={image}
          setImage={setImage} // Pass set state functions
          id={id}
          setId={setId} // Pass set state functions
          departmentId={departmentId}
          setDepartmentId={setDepartmentId} // Pass set state functions
        />
      </Box>
    </AppTheme>
  );
}
