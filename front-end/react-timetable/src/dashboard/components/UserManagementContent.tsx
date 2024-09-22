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
} from "@mui/material";
import { useEffect, useState } from "react";
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
    courses: [];
  };
  dateOfBirth: string;
  pic: string;
}

export default function UserManagementContent({
  selectedContent,
}: UserManagementContentProps) {
  const [students, setStudents] = useState<Student[]>([]);
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

    fetchStudents();
  }, []);

  const handleRowClick = (student: Student) => {
    setSelectedStudent(student);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStudent(null);
  };

  const handleSave = () => {
    console.log("Updated Student:", selectedStudent);
    handleCloseModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedStudent) {
      setSelectedStudent({
        ...selectedStudent,
        [e.target.name]: e.target.value,
      });
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
        fontFamily: "Roboto, sans-serif", // Apply Roboto font
      })}
    >
      <Stack
        spacing={2}
        sx={{
          alignItems: "center",
          mx: 3,
          pb: 10,
          mt: { xs: 8, md: 0 },
          fontFamily: "Roboto, sans-serif", // Apply font family to Stack
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
          sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "800px" } }} // Set modal width
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
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    "& .MuiInputLabel-root": {
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 500,
                      color: "text.secondary", // Adjust color to ensure visibility
                      "&.Mui-focused": {
                        color: "primary.main", // Change color when focused
                      },
                    },
                    "& .MuiInputBase-root": {
                      fontFamily: "Roboto, sans-serif",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "text.secondary", // Border color
                      },
                      "&:hover fieldset": {
                        borderColor: "primary.main", // Border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main", // Border color when focused
                      },
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
                      fontFamily: "Roboto, sans-serif", // Apply font family to label
                      fontWeight: 500, // Adjust font weight if needed
                    },
                    "& .MuiInputBase-root": {
                      fontFamily: "Roboto, sans-serif", // Apply font family to input text
                    },
                  }}
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={selectedStudent.password}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    "& .MuiInputLabel-root": {
                      fontFamily: "Roboto, sans-serif", // Apply font family to label
                      fontWeight: 500, // Adjust font weight if needed
                    },
                    "& .MuiInputBase-root": {
                      fontFamily: "Roboto, sans-serif", // Apply font family to input text
                    },
                  }}
                />
                <TextField
                  label="Department"
                  name="department_name"
                  value={selectedStudent.department.department_name}
                  onChange={handleChange}
                  fullWidth
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    "& .MuiInputLabel-root": {
                      fontFamily: "Roboto, sans-serif", // Apply font family to label
                      fontWeight: 500, // Adjust font weight if needed
                    },
                    "& .MuiInputBase-root": {
                      fontFamily: "Roboto, sans-serif", // Apply font family to input text
                    },
                  }}
                />
                <TextField
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={selectedStudent.dateOfBirth.split("T")[0]} // Formatting date input
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    "& .MuiInputLabel-root": {
                      fontFamily: "Roboto, sans-serif", // Apply font family to label
                      fontWeight: 500, // Adjust font weight if needed
                    },
                    "& .MuiInputBase-root": {
                      fontFamily: "Roboto, sans-serif", // Apply font family to input text
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
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}
