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
import EditCourseModal from "./EditCourseModal"; // Import the EditCourseModal

// Interface for courses and departments
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
}

interface Department {
  id: number;
  department_name: string;
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
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [adminCourses, setAdminCourses] = React.useState<AdminCourse[]>([]);

  // State for modal and new course data
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [selectedCourse, setSelectedCourse] =
    React.useState<AdminCourse | null>(null);

  const [newCourse, setNewCourse] = React.useState({
    courseName: "",
    departmentId: "",
  });

  // State for departments
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] =
    React.useState<boolean>(true);

  // Fetch courses when component mounts
  React.useEffect(() => {
    const fetchCourses = async () => {
      if (userType === "student" || userType === "teachers") {
        try {
          const response = await axios.get(
            `http://localhost:8080/departments/${departmentId}`
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
      try {
        const response = await axios.get(`http://localhost:8080/courses`);
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

  // Handle adding a new course
  const handleAddCourse = async () => {
    try {
      const response = await axios.post("http://localhost:8080/courses", {
        courseName: newCourse.courseName,
        departmentId: newCourse.departmentId,
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
        },
      ]);

      setNewCourse({ courseName: "", departmentId: "" });
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
            departments={departments}
            onCourseUpdated={handleCourseUpdated}
            onCourseDeleted={handleCourseDeleted}
          />
        )}
      </Stack>
    </Box>
  );
}
