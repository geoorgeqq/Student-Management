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

// Interface for department and courses data
interface Course {
  id: number;
  courseName: string;
  enrollment: any[];
}

interface Department {
  id: number;
  department_name: string;
  courses: Course[];
}

interface CoursesContentProps {
  selectedContent: string;
}

export default function CoursesContent({
  selectedContent,
}: CoursesContentProps) {
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch data when component mounts
  React.useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/student/departments"
        );
        setDepartments(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchDepartments();
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
        fontFamily: "Roboto", // Apply Roboto font to the entire Box
      })}
    >
      <Stack
        spacing={2}
        sx={{
          alignItems: "center",
          mx: 3,
          pb: 10,
          mt: { xs: 8, md: 0 },
          fontFamily: "Roboto", // Apply Roboto font to all children of Stack
        }}
      >
        <Header selectedContent={selectedContent} />

        {/* Table */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="courses table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                  Course Name
                </TableCell>
                <TableCell sx={{ fontFamily: "Roboto", fontWeight: "bold" }}>
                  Department Name
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
              {departments.map((department) =>
                department.courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell sx={{ fontFamily: "Roboto" }}>
                      {course.courseName}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "Roboto" }}>
                      {department.department_name}
                    </TableCell>
                    <TableCell align="right" sx={{ fontFamily: "Roboto" }}>
                      {course.enrollment.length}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}
