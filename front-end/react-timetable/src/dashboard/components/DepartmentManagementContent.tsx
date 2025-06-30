import {
  Box,
  alpha,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
} from "@mui/material";
import Header from "./Header";
import { useState, useEffect } from "react";
import axios from "axios";

// Define the Department interface with id and department_name
interface Department {
  id: number;
  department_name: string;
}

interface DepartmentManagementContentProps {
  selectedContent: string;
}

export default function DepartmentManagementContent({
  selectedContent,
}: DepartmentManagementContentProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [open, setOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // New success message state
  const [editMode, setEditMode] = useState(false); // For tracking edit mode
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null); // For tracking the selected department
  const jwtToken = localStorage.getItem("jsonWebToken");
  // Fetch the departments from the API
  useEffect(() => {
    axios
      .get("http://localhost:8080/departments", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setErrorMessage("Session expired. Please log in again.");
          localStorage.removeItem("jsonWebToken");
          setTimeout(() => {
            window.location.href = "/sign-in";
          }, 2000);
        } else {
          console.error("Error fetching departments:", error);
        }
      });
  }, []);

  // Handle opening the modal for adding a new department
  const handleClickOpen = () => {
    setEditMode(false); // Disable edit mode when adding a new department
    setNewDepartmentName("");
    setSelectedDepartment(null);
    setOpen(true);
  };

  // Handle closing the modal
  const handleClose = () => {
    setOpen(false);
  };

  // Handle adding a new department
  const handleAddDepartment = () => {
    const newDepartment = {
      department_name: newDepartmentName,
    };

    axios
      .put("http://localhost:8080/departments", newDepartment, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        if (response.data && response.data.id) {
          setDepartments([...departments, response.data]); // Update state with the newly added department
          setNewDepartmentName(""); // Clear the input field
          handleClose(); // Close the modal after submission
          setSuccessMessage("Department added successfully!"); // Success message
          setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
        }
      })
      .catch((error) => {
        console.error("Error adding department:", error);
        if (error.response && error.response.status === 500) {
          setErrorMessage("Department already exists!");
          setTimeout(() => setErrorMessage(null), 3000); // Clear message after 3 seconds
          handleClose();
        }
      });
  };

  // Handle row click to edit or delete department
  const handleRowClick = (department: Department) => {
    setSelectedDepartment(department);
    setNewDepartmentName(department.department_name); // Pre-fill the input field with department name
    setEditMode(true); // Enable edit mode
    setOpen(true); // Open the modal
  };

  // Handle editing a department
  const handleEditDepartment = () => {
    if (!selectedDepartment) return;

    axios
      .post(
        `http://localhost:8080/departments/${selectedDepartment.id}`,
        {
          department_name: newDepartmentName,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      .then((response) => {
        const updatedDepartments = departments.map((dept) =>
          dept.id === selectedDepartment.id
            ? { ...dept, department_name: newDepartmentName }
            : dept
        );
        setDepartments(updatedDepartments); // Update the state with the edited department
        handleClose();
        setSuccessMessage("Department edited successfully!"); // Success message for edit
        setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
      })
      .catch((error) => {
        console.error("Error updating department:", error);
      });
  };

  // Handle deleting a department
  const handleDeleteDepartment = () => {
    if (!selectedDepartment) return;

    axios
      .delete(`http://localhost:8080/departments/${selectedDepartment.id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then(() => {
        const remainingDepartments = departments.filter(
          (dept) => dept.id !== selectedDepartment.id
        );
        setDepartments(remainingDepartments); // Remove the department from the state
        handleClose();
        setSuccessMessage("Department deleted successfully!"); // Success message for delete
        setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
      })
      .catch((error) => {
        console.error("Error deleting department:", error);
      });
  };

  return (
    <Box
      component="main"
      sx={(theme) => ({
        width: "100%",
        flexGrow: 1,
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
          : alpha(theme.palette.background.default, 1),
        overflow: "auto",
        fontFamily: "Roboto, sans-serif",
      })}
    >
      <Stack
        spacing={2}
        sx={{
          alignItems: "center",
          mx: 3,
          pb: 10,
          mt: { xs: 8, md: 0 },
          fontFamily: "Roboto, sans-serif",
        }}
      >
        {/* Render the Header component */}
        <Header selectedContent={selectedContent} />

        {/* Error Message Display */}
        {errorMessage && (
          <Alert
            severity="error"
            onClose={() => setErrorMessage(null)}
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </Alert>
        )}

        {/* Success Message Display */}
        {successMessage && (
          <Alert
            severity="success" // This ensures a green color by default
            onClose={() => setSuccessMessage(null)}
            sx={{
              width: "100%",
            }} // Explicitly set background and text color
          >
            {successMessage}
          </Alert>
        )}

        {/* Department Table */}
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ fontFamily: "Roboto, sans-serif" }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontFamily: "Roboto, sans-serif", textAlign: "left" }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{ fontFamily: "Roboto, sans-serif", textAlign: "right" }}
                >
                  Department Name
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {departments.map((department) => (
                <TableRow
                  key={department.id}
                  hover
                  onClick={() => handleRowClick(department)} // Handle row click for editing/deleting
                >
                  <TableCell
                    sx={{ fontFamily: "Roboto, sans-serif", textAlign: "left" }}
                  >
                    {department.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "Roboto, sans-serif",
                      textAlign: "right",
                    }}
                  >
                    {department.department_name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Button
          variant="outlined"
          color="primary"
          sx={{ fontFamily: "Roboto, sans-serif" }}
          onClick={handleClickOpen}
        >
          Add Department
        </Button>

        {/* Add/Edit/Delete Department Modal */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editMode ? "Edit Department" : "Add New Department"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {editMode
                ? "You can edit the department name or delete it."
                : "Please enter the name of the new department."}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Department Name"
              fullWidth
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            {editMode ? (
              <>
                <Button onClick={handleDeleteDepartment} color="error">
                  Delete
                </Button>
                <Button onClick={handleEditDepartment} color="primary">
                  Save
                </Button>
              </>
            ) : (
              <Button onClick={handleAddDepartment} color="primary">
                Add
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}
