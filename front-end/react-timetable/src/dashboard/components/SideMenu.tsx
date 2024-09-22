import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  overflow: "hidden", // Added to prevent scrollbar
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
    overflow: "hidden", // Added to prevent scrollbar on paper
  },
});

// Function to generate a color from a string
function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

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
  userType: string;
  onMenuClick: (content: string) => void;
  selectedContent: string;
}

// Main component
export default function SideMenu({
  name,
  email,
  image,
  userType,
  onMenuClick,
  selectedContent,
}: SideMenuProps) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
          overflow: "hidden", // Added to prevent scrollbar
          width: "18%",
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
        }}
      >
        <Avatar
          sizes="small"
          src={image || undefined}
          {...(image ? {} : stringAvatar(name || "FirstName LastName"))}
          sx={{ width: 36, height: 36 }}
        />

        <Box sx={{ mr: "auto" }}>
          {(userType === "student" || userType === "teacher") && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: 300,
                lineHeight: "8px",
                fontFamily: "Roboto, sans-serif",
              }}
            >
              {name}
            </Typography>
          )}
          {(userType === "student" || userType === "teacher") && (
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", fontFamily: "Roboto, sans-serif" }}
            >
              {email}
            </Typography>
          )}
          {userType === "admin" && (
            <Typography
              variant="caption"
              sx={{
                color: "text.primary",
                fontSize: 15,
                fontFamily: "Roboto, sans-serif",
              }}
            >
              {email}
            </Typography>
          )}
        </Box>
        <OptionsMenu
          onMenuClick={onMenuClick}
          selectedContent={selectedContent}
        />
      </Stack>
      <Box
        sx={{
          display: "flex",
        }}
      ></Box>
      <Divider />
      <MenuContent userType={userType} onMenuClick={onMenuClick} />
    </Drawer>
  );
}
