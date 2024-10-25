import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";
import Header from "./Header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import {
  TextareaAutosize as BaseTextareaAutosize,
  TextareaAutosize,
} from "@mui/base/TextareaAutosize";

import { makeStyles } from "@mui/styles"; // Import makeStyles
import EditCourseModal from "./EditCourseModal";
import axiosInstance from "./axiosConfig";

// Define the styles with makeStyles
const useStyles = makeStyles({
  textarea: {
    height: "100%",
    width: "100%",
    fontSize: "16px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "#05070a",
    marginTop: "0.3rem",
    color: "white",
    "&::placeholder": {
      color: "#929eb6", // Apply placeholder color here
    },
  },
});

interface Course {
  id: number;
  courseName: string;
  enrollment: any[];
}

interface AdminCourse {
  id: number;
  courseName: string;
  enrollment: any[];
  department: Department;
  description: string;
  location: string;
  teacher: {
    id: string;
    name: string;
  };
}

interface Department {
  id: number;
  department_name: string;
}

interface Teacher {
  id: number;
  name: string;
}

interface CoursesContentProps {
  selectedContent: string;
  departmentId?: string;
  userType: string | undefined;
}

export default function CoursesContent({
  selectedContent,
  departmentId,
  userType,
}: CoursesContentProps) {
  const classes = useStyles(); // Call the useStyles function
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [adminCourses, setAdminCourses] = React.useState<AdminCourse[]>([]);
  const [teachers, setTeachers] = React.useState<Teacher[]>([]); // State for teachers

  // State for modal and new course data
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedCourse, setSelectedCourse] =
    React.useState<AdminCourse | null>(null);

  const [newCourse, setNewCourse] = React.useState({
    courseName: "",
    departmentId: "",
    description: "",
    location: "",
    teacherId: "",
  });

  // State for departments
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] =
    React.useState<boolean>(true);

  // Fetch courses when component mounts
  React.useEffect(() => {
    const fetchCourses = async () => {
      const jwtToken = localStorage.getItem("jsonWebToken");

      if (
        (userType === "student" || userType === "teacher") &&
        departmentId &&
        jwtToken
      ) {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://localhost:8080/departments/${departmentId}`,
            {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          );
          setCourses(response.data);
        } catch (err) {
          setError("Failed to fetch department courses");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [departmentId, userType]);

  React.useEffect(() => {
    const fetchAdminCourses = async () => {
      const jwtToken = localStorage.getItem("jsonWebToken");
      console.log(jwtToken);
      try {
        const response = await axiosInstance.get(
          `http://localhost:8080/courses`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setAdminCourses(response.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminCourses();
  }, []);

  // Fetch departments when the modal opens
  React.useEffect(() => {
    const fetchDepartments = async () => {
      if (openAdd || openEdit) {
        try {
          const response = await axios.get("http://localhost:8080/departments");
          setDepartments(response.data);
        } catch (err) {
          setError("Failed to fetch departments");
        } finally {
          setLoadingDepartments(false);
        }
      }
    };

    fetchDepartments();
  }, [openAdd, openEdit]);

  // Fetch teachers based on selected department
  React.useEffect(() => {
    const fetchTeachers = async () => {
      if (newCourse.departmentId) {
        try {
          const response = await axios.get(
            `http://localhost:8080/teachers/departments/${newCourse.departmentId}`
          );
          setTeachers(response.data);
        } catch (err) {
          setError("Failed to fetch teachers");
        }
      }
    };

    fetchTeachers();
  }, [newCourse.departmentId]);

  // Handle adding a new course
  const handleAddCourse = async () => {
    try {
      const response = await axios.post("http://localhost:8080/courses", {
        courseName: newCourse.courseName,
        departmentId: newCourse.departmentId,
        description: newCourse.description,
        location: newCourse.location,
        teacherId: newCourse.teacherId,
      });

      const addedCourse = response.data;

      setAdminCourses((prevCourses) => [
        ...prevCourses,
        {
          id: addedCourse.id,
          courseName: addedCourse.courseName,
          enrollment: addedCourse.enrollment || [],
          department: {
            id: addedCourse.department.id,
            department_name: addedCourse.department.department_name,
          },
          description: addedCourse.description || "",
          location: addedCourse.location,
          teacher: {
            id: addedCourse.teacher.id,
            name: addedCourse.teacher.name, // Accessing teacher.id instead of teacherId
          },
        },
      ]);

      setNewCourse({
        courseName: "",
        departmentId: "",
        description: "",
        location: "",
        teacherId: "",
      });
      setOpenAdd(false);
    } catch (err) {
      setError("Failed to add course");
    }
  };

  // Handle updating a course
  const handleCourseUpdated = (updatedCourse: AdminCourse) => {
    setAdminCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  };

  // Handle deleting a course
  const handleCourseDeleted = (courseId: number) => {
    setAdminCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== courseId)
    );
  };

  // Display loading state or error state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Box
      component="main"
      sx={(theme) => ({
        flexGrow: 1,
        backgroundColor: theme.vars
          ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
          : alpha(theme.palette.background.default, 1),
        overflow: "auto",
        fontFamily: "Roboto",
      })}
    >
      <Stack
        spacing={2}
        sx={{
          alignItems: "center",
          mx: 3,
          pb: 10,
          mt: { xs: 8, md: 0 },
          fontFamily: "Roboto",
        }}
      >
        <Header selectedContent={selectedContent} />

        {/* Table for Students */}
        {(userType === "student" || userType === "teachers") && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="courses table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                    Course Name
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontFamily: "Roboto", fontWeight: "bold" }}
                  >
                    Enrolled
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell sx={{ fontFamily: "Roboto" }}>
                      {course.courseName}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: "Roboto" }}>
                      {course.enrollment.length}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Table for Admins */}
        {userType === "admin" && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="courses table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                    Department Name
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontFamily: "Roboto", fontWeight: "bold" }}
                  >
                    Course Name
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontFamily: "Roboto", fontWeight: "bold" }}
                  >
                    Enrolled
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adminCourses.map((adminCourse) => (
                  <TableRow
                    key={adminCourse.id}
                    onClick={() => {
                      setSelectedCourse(adminCourse);
                      setOpenEdit(true);
                    }}
                    sx={{ cursor: "pointer" }} // Makes the mouse pointer a hand on hover
                  >
                    <TableCell sx={{ fontFamily: "Roboto" }}>
                      {adminCourse.department.department_name}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: "Roboto" }}>
                      {adminCourse.courseName}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: "Roboto" }}>
                      {adminCourse.enrollment.length}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Add Course Button */}
        {userType === "admin" && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpenAdd(true)}
          >
            Add Course
          </Button>
        )}

        {/* Add Course Modal */}
        <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
          <DialogTitle>Add Course</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Course Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newCourse.courseName}
              onChange={(e) =>
                setNewCourse({ ...newCourse, courseName: e.target.value })
              }
            />
            <TextareaAutosize
              minRows={3} // Minimum number of rows to display
              placeholder="Description"
              value={newCourse.description}
              onChange={(e) =>
                setNewCourse({ ...newCourse, description: e.target.value })
              }
              className={classes.textarea}
            />
            <TextField
              margin="dense"
              label="Location"
              type="text"
              fullWidth
              variant="outlined"
              value={newCourse.location}
              onChange={(e) =>
                setNewCourse({ ...newCourse, location: e.target.value })
              }
            />
            <FormControl fullWidth margin="dense">
              <InputLabel id="department-select-label">Department</InputLabel>
              <Select
                labelId="department-select-label"
                value={newCourse.departmentId}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, departmentId: e.target.value })
                }
              >
                {departments.map((department) => (
                  <MenuItem key={department.id} value={department.id}>
                    {department.department_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel id="teacher-select-label">Teacher</InputLabel>
              <Select
                labelId="teacher-select-label"
                value={newCourse.teacherId}
                onChange={(e) =>
                  setNewCourse({ ...newCourse, teacherId: e.target.value })
                }
              >
                {teachers.map((teacher) => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddCourse} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Course Modal */}
        {selectedCourse && (
          <EditCourseModal
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            courseId={selectedCourse.id}
            existingCourseName={selectedCourse.courseName}
            existingDepartmentId={selectedCourse.department.id.toString()}
            existingCourseDescription={selectedCourse.description}
            existingCourseLocation={selectedCourse.location}
            existingTeacherId={selectedCourse.teacher.id}
            departments={departments}
            onCourseUpdated={handleCourseUpdated} // This should match the expected type
            onCourseDeleted={handleCourseDeleted}
          />
        )}
      </Stack>
    </Box>
  );
}
