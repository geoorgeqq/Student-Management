import * as React from "react";
import type {} from "@mui/x-date-pickers/themeAugmentation";
import type {} from "@mui/x-charts/themeAugmentation";
import type {} from "@mui/x-data-grid/themeAugmentation";
import type {} from "@mui/x-tree-view/themeAugmentation";
import { alpha, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import AppNavbar from "./components/AppNavbar";
import Header from "./components/Header";
import MainGrid from "./components/MainGrid";
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
      @font-face{
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
  const { name, email, image, id, departmentId } = location.state;
  const { type } = useParams<{ type: string }>();

  const [selectedContent, setSelectedContent] = React.useState("home");

  const handleMenuClick = (content: string) => {
    setSelectedContent(content);
  };

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />%
      <Box sx={{ display: "flex" }}>
        <SideMenu
          userType={type || "student"}
          name={name}
          email={email}
          image={image}
          onMenuClick={handleMenuClick}
        />
        <AppNavbar />
        {/* Main content */}
        <ContentRenderer
          selectedContent={selectedContent}
          id={id}
          departmentId={departmentId}
        />
      </Box>
    </AppTheme>
  );
}
