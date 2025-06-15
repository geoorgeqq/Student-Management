import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { Menu, MenuItem } from "@mui/material"; // Use Material UI's standard Menu components

interface NavbarProps {
  loggedIn: boolean;
  onLoginLogout: () => void;
}

export const Navbar = ({ loggedIn, onLoginLogout }: NavbarProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = (type: string) => {
    if (loggedIn) {
      onLoginLogout(); // Log out if logged in
    } else {
      localStorage.setItem("role", type);
      navigate(`/${type}/login`); // Redirect to the specific login type
    }
    handleClose(); // Close the menu after clicking
  };

  const handleRegisterClick = () => {
    navigate(`/student/register`);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Timetable
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Button href="#about" color="inherit">
                About
              </Button>
            </li>
            <li className="nav-item">
              <Button variant="outlined" onClick={handleRegisterClick}>
                Register
              </Button>
            </li>
            <li className="nav-item">
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                variant="outlined"
                onClick={handleClick}
                className="ms-3"
              >
                Login
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl} // Correct the prop name to 'anchorEl'
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <>
                  <MenuItem onClick={() => handleLoginClick("admin")}>
                    Admin Login
                  </MenuItem>
                  <MenuItem onClick={() => handleLoginClick("teacher")}>
                    Teacher Login
                  </MenuItem>
                  <MenuItem onClick={() => handleLoginClick("student")}>
                    Student Login
                  </MenuItem>
                </>
              </Menu>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
