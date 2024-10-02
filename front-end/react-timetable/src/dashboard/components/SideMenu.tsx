import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";

const drawerWidth = 300; // Adjusted width for better display

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  overflow: "hidden",
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    overflow: "hidden",
  },
});

// Function to generate a color from a string
function stringToColor(string: string) {
  let hash = 0;
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

// Function to create an avatar
function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

interface SideMenuProps {
  name: string;
  email: string;
  image: string;
  userType: string | undefined;
  onMenuClick: (content: string) => void;
  selectedContent: string;
}

// Main component
const SideMenu: React.FC<SideMenuProps> = ({
  name,
  email,
  image,
  userType,
  onMenuClick,
  selectedContent,
}) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
          flexWrap: "nowrap", // Prevent wrapping
        }}
      >
        <Avatar
          sizes="small"
          src={image || undefined}
          {...(image ? {} : stringAvatar(name || "FirstName LastName"))}
          sx={{ width: 36, height: 36 }}
        />

        <Box
          sx={{
            flexGrow: 1, // Allow it to grow
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap", // Prevent line breaks
            mr: "auto", // Automatically adjust space
          }}
        >
          {(userType === "student" || userType === "teachers") && (
            <Tooltip title={name} arrow>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 300,
                  lineHeight: "1.2",
                  fontFamily: "Roboto, sans-serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </Typography>
            </Tooltip>
          )}
          {(userType === "student" || userType === "teachers") && (
            <Tooltip title={email} arrow>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  fontFamily: "Roboto, sans-serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {email}
              </Typography>
            </Tooltip>
          )}
          {userType === "admin" && (
            <Tooltip title={email} arrow>
              <Typography
                variant="caption"
                sx={{
                  color: "text.primary",
                  fontSize: 15,
                  fontFamily: "Roboto, sans-serif",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {email}
              </Typography>
            </Tooltip>
          )}
        </Box>
        <OptionsMenu
          onMenuClick={onMenuClick}
          selectedContent={selectedContent}
          userType={userType}
        />
      </Stack>
      <Divider />
      <MenuContent userType={userType} onMenuClick={onMenuClick} />
    </Drawer>
  );
};

export default SideMenu;
