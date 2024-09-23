import {
  Box,
  alpha,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Header from "./Header";

interface UserManagementContentProps {
  selectedContent: string;
}

interface Student {
  id: number;
  name: string;
  email: string;
  password: string;
  department: {
    id: number;
    department_name: string;
  };
  dateOfBirth: string;
  pic: string;
}

interface Department {
  id: number;
  department_name: string;
  courses: any[]; // Assuming it's an array of any objects, replace with the actual type if needed
}

export default function UserManagementContent({
  selectedContent,
}: UserManagementContentProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:8080/student");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Student[] = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await fetch("http://localhost:8080/departments");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Department[] = await response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };

    fetchStudents();
    fetchDepartments();
  }, []);

  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setOpenModal(true);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setShowPassword(false);
    setSelectedStudent(null);
  };

  const handleSave = async () => {
    if (selectedStudent) {
      try {
        const response = await fetch(
          `http://localhost:8080/student/${selectedStudent.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: selectedStudent.id,
              name: selectedStudent.name,
              email: selectedStudent.email,
              password: selectedStudent.password,
              department: selectedStudent.department,
              dateOfBirth: selectedStudent.dateOfBirth,
              pic: selectedStudent.pic,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update student");
        }

        const updatedStudents = students.map((student) =>
          student.id === selectedStudent.id ? selectedStudent : student
        );
        setStudents(updatedStudents);
        handleCloseModal();
      } catch (error) {
        console.error("Error updating student:", error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedStudent) {
      try {
        const response = await fetch(
          `http://localhost:8080/student/${selectedStudent.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete student");
        }

        const updatedStudents = students.filter(
          (student) => student.id !== selectedStudent.id
        );
        setStudents(updatedStudents);
        handleCloseModal();
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedStudent) {
      setSelectedStudent({
        ...selectedStudent,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleDepartmentChange = (e: any) => {
    if (selectedStudent) {
      const selectedDept = departments.find(
        (dept) => dept.id === e.target.value
      );
      if (selectedDept) {
        setSelectedStudent({
          ...selectedStudent,
          department: {
            ...selectedDept,
          },
        });
      }
    }
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
        <Header selectedContent={selectedContent} />

        <TableContainer component={Paper} sx={{ mx: "auto", mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography
                    fontWeight="bold"
                    sx={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight="bold"
                    sx={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight="bold"
                    sx={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    Email
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight="bold"
                    sx={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    Department
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    fontWeight="bold"
                    sx={{ fontFamily: "Roboto, sans-serif" }}
                  >
                    Date of Birth
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow
                  key={student.id}
                  onClick={() => handleRowClick(student)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell sx={{ fontFamily: "Roboto, sans-serif" }}>
                    {student.id}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Roboto, sans-serif" }}>
                    {student.name}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Roboto, sans-serif" }}>
                    {student.email}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Roboto, sans-serif" }}>
                    {student.department.department_name}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "Roboto, sans-serif" }}>
                    {new Date(student.dateOfBirth).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for Editing Student Information */}
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          sx={{
            "& .MuiDialog-paper": {
              width: "80%",
              maxWidth: "800px",
              padding: 2, // Add padding to ensure space around the content
            },
          }}
        >
          <DialogTitle
            sx={{ fontFamily: "Roboto, sans-serif", fontWeight: 600 }}
          >
            Edit Student Information
          </DialogTitle>
          <DialogContent>
            {selectedStudent && (
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  name="name"
                  value={selectedStudent.name}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    style: { marginTop: "0px" }, // Adjust this value as needed
                  }}
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    "& .MuiInputBase-root": {
                      fontFamily: "Roboto, sans-serif",
                    },
                  }}
                />

                <TextField
                  label="Email"
                  name="email"
                  value={selectedStudent.email}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    "& .MuiInputLabel-root": {
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-root": {
                      fontFamily: "Roboto, sans-serif",
                    },
                  }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"} // Toggle between text and password
                  value={selectedStudent.password}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    "& .MuiInputLabel-root": {
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-root": {
                      fontFamily: "Roboto, sans-serif",
                    },
                    position: "relative", // Important for absolute positioning inside TextField
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
                <FormControl fullWidth>
                  <InputLabel
                    sx={{
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Department
                  </InputLabel>
                  <Select
                    value={selectedStudent.department.id}
                    onChange={handleDepartmentChange}
                    label="Department"
                    sx={{
                      fontFamily: "Roboto, sans-serif",
                    }}
                  >
                    {departments.map((dept) => (
                      <MenuItem
                        key={dept.id}
                        value={dept.id}
                        sx={{ fontFamily: "Roboto, sans-serif" }}
                      >
                        {dept.department_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={selectedStudent.dateOfBirth.split("T")[0]}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    "& .MuiInputLabel-root": {
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 500,
                    },
                    "& .MuiInputBase-root": {
                      fontFamily: "Roboto, sans-serif",
                    },
                  }}
                />
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModal}
              sx={{ fontFamily: "Roboto, sans-serif" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              color="primary"
              sx={{ fontFamily: "Roboto, sans-serif" }}
            >
              Save
            </Button>
            {/* Add Delete Button */}
            <Button
              onClick={handleDelete}
              color="error"
              sx={{ fontFamily: "Roboto, sans-serif" }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}
