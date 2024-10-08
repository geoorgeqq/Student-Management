import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddCircle from "@mui/icons-material/AddCircle";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon /> },
  { text: "About", icon: <InfoRoundedIcon /> },
  { text: "Feedback", icon: <HelpRoundedIcon /> },
];

interface MenuContentProps {
  userType: string | undefined;
  onMenuClick: (content: string) => void;
}

export default function MenuContent({
  userType,
  onMenuClick,
}: MenuContentProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    content: string
  ) => {
    setSelectedIndex(index);
    onMenuClick(content);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        <ListItem
          disablePadding
          sx={{ display: "block", fontFamily: "Roboto" }}
        >
          <ListItemButton
            selected={selectedIndex === 0}
            onClick={(event) => handleListItemClick(event, 0, "Home")}
          >
            <ListItemIcon>
              <HomeRoundedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Home"
              primaryTypographyProps={{ fontFamily: "Roboto" }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedIndex === 1}
            onClick={(event) => handleListItemClick(event, 1, "Courses")}
          >
            <ListItemIcon>
              <SchoolIcon />
            </ListItemIcon>
            <ListItemText
              primary="Courses"
              primaryTypographyProps={{ fontFamily: "Roboto" }}
            />
          </ListItemButton>
        </ListItem>
        {userType === "student" && (
          <ListItem disablePadding>
            <ListItemButton
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2, "Join Course")}
            >
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText
                primary="Join Course"
                primaryTypographyProps={{ fontFamily: "Roboto" }}
              />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedIndex === 3}
            onClick={(event) =>
              handleListItemClick(event, 3, "Course Scheduler")
            }
          >
            <ListItemIcon>
              <AccessTimeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Course Scheduler"
              primaryTypographyProps={{ fontFamily: "Roboto" }}
            />
          </ListItemButton>
        </ListItem>

        {/* Admin-specific items */}
        {userType === "admin" && (
          <>
            <ListItem
              disablePadding
              sx={{ display: "block", fontFamily: "Roboto" }}
            >
              <ListItemButton
                selected={selectedIndex === 4}
                onClick={(event) =>
                  handleListItemClick(event, 4, "Admin Settings")
                }
              >
                <ListItemIcon>
                  <SettingsRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Admin Settings"
                  primaryTypographyProps={{ fontFamily: "Roboto" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedIndex === 5}
                onClick={(event) =>
                  handleListItemClick(event, 5, "User Management")
                }
              >
                <ListItemIcon>
                  <HelpRoundedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="User Management"
                  primaryTypographyProps={{ fontFamily: "Roboto" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedIndex === 6}
                onClick={(event) =>
                  handleListItemClick(event, 6, "Teacher Management")
                }
              >
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Teacher Management"
                  primaryTypographyProps={{ fontFamily: "Roboto" }}
                />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                selected={selectedIndex === 7}
                onClick={(event) =>
                  handleListItemClick(event, 7, "Department Management")
                }
              >
                <ListItemIcon>
                  <AccountBalanceIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Department Management"
                  primaryTypographyProps={{ fontFamily: "Roboto" }}
                />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ fontFamily: "Roboto" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
