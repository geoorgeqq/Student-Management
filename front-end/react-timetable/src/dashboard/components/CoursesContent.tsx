import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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
import axios from "axios";

// Interface for courses data
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
  const [adminCourses, setAdminCourses] = React.useState<AdminCourse[]>([]); // Updated type to AdminCourse

  // Fetch data when component mounts
  React.useEffect(() => {
    const fetchCourses = async () => {
      if (userType === "student" || userType === "teacher") {
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
        setLoading(false); // Ensure loading is set to false for non-student/teacher types
      }
    };

    fetchCourses();
  }, [departmentId, userType]);

  React.useEffect(() => {
    const fetchAdminCourses = async () => {
      // Renamed for clarity
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
        {userType === "student" && (
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
                  <TableRow key={adminCourse.id}>
                    <TableCell sx={{ fontFamily: "Roboto" }}>
                      {adminCourse.department.department_name}{" "}
                      {/* Corrected to show Department ID */}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: "Roboto" }}>
                      {adminCourse.courseName}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: "Roboto" }}>
                      {adminCourse.enrollment.length}{" "}
                      {/* Corrected to show Department ID */}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Box>
  );
}
