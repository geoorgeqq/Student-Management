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

interface CoursesContentProps {
  selectedContent: string;
  departmentId: string;
}

export default function CoursesContent({
  selectedContent,
  departmentId,
}: CoursesContentProps) {
  const [courses, setCourses] = React.useState<Course[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch data when component mounts
  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/departments/${departmentId}`
        );
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchCourses();
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

        {/* Table */}
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
      </Stack>
    </Box>
  );
}
