import * as React from "react";
import { styled } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MuiMenuItem from "@mui/material/MenuItem";
import { paperClasses } from "@mui/material/Paper";
import { listClasses } from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import MenuButton from "./MenuButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import dividerClasses from "@mui/material/Divider/dividerClasses";

const MenuItem = styled(MuiMenuItem)({
  margin: "2px 0",
  fontFamily: "Roboto, sans-serif", // Added Roboto font
});

interface OptionsMenuProps {
  onMenuClick: (content: string) => void;
  selectedContent: string;
}

export default function OptionsMenu({
  onMenuClick,
  selectedContent,
}: OptionsMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    content: string
  ) => {
    onMenuClick(content);
  };

  return (
    <React.Fragment>
      <MenuButton
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        <MoreVertRoundedIcon />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: "4px",
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
          },
          [`& .${dividerClasses.root}`]: {
            margin: "4px -4px",
          },
        }}
      >
        <MenuItem onClick={(event) => handleListItemClick(event, "My Account")}>
          My account
        </MenuItem>
        <MenuItem onClick={(event) => handleListItemClick(event, "Settings")}>
          Settings
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: "auto",
              minWidth: 0,
            },
          }}
        >
          <ListItemText
            primary="Logout"
            sx={{ fontFamily: "Roboto, sans-serif" }}
          />
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
