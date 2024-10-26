import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Typography,
  Stack,
  alpha,
  Box,
} from "@mui/material";
import Header from "./Header";

interface Course {
  id: string; // Use string to handle Long values
  courseName: string;
}

interface EnrollCourseProps {
  selectedContent: string;
  departmentId?: string;
  studentId: string; // Use string to handle Long values
}

export default function EnrollCourse({
  selectedContent,
  departmentId,
  studentId,
}: EnrollCourseProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(
    new Set()
  );
  const jwtToken = localStorage.getItem("jsonWebToken");

  const handleCourseChange = (event: SelectChangeEvent<string>) => {
    setSelectedCourseId(event.target.value);
  };

  const handleEnroll = async () => {
    if (selectedCourseId) {
      try {
        const response = await fetch("http://localhost:8080/student/enroll", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            studentId: studentId,
            courseId: selectedCourseId,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to enroll in course: ${errorText}`);
        }

        const result = await response.json();

        // Add the enrolled course ID to the enrolledCourses state
        setEnrolledCourses((prev) => new Set(prev).add(selectedCourseId));

        alert(
          `You have successfully enrolled in the course: ${result.courseName}`
        );
      } catch (error) {
        alert("Error enrolling in the course. Please try again.");
        console.error("Error enrolling in course: ", error);
      }
    } else {
      alert("Please select a course to enroll in.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/departments/${departmentId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result: Course[] = await response.json();
        setData(result);
      } catch (error) {
        setError("Error fetching data. Please try again.");
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/student/enrolled/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch enrolled courses");
        }
        const enrolledCoursesData: Course[] = await response.json();
        const enrolledIds = new Set(
          enrolledCoursesData.map((course) => course.id)
        );
        setEnrolledCourses(enrolledIds);
      } catch (error) {
        console.error("Error fetching enrolled courses: ", error);
      }
    };

    fetchData();
    fetchEnrolledCourses(); // Fetch the enrolled courses
  }, [departmentId, studentId]);

  // Filter out the enrolled courses from the available courses
  const availableCourses = data.filter(
    (course) => !enrolledCourses.has(course.id)
  );

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
        <Typography variant="h5" gutterBottom sx={{ fontFamily: "Roboto" }}>
          Enroll in a Course
        </Typography>

        {loading ? (
          <Typography>Loading courses...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : availableCourses.length === 0 ? (
          <Typography>No courses available for this department.</Typography>
        ) : (
          <FormControl fullWidth margin="normal" sx={{ fontFamily: "Roboto" }}>
            <InputLabel id="course-select-label" sx={{ fontFamily: "Roboto" }}>
              Available courses
            </InputLabel>
            <Select
              labelId="course-select-label"
              id="course-select"
              value={selectedCourseId || ""}
              label="Select Course"
              onChange={handleCourseChange}
              sx={{ fontFamily: "Roboto" }}
            >
              {availableCourses.map((course) => (
                <MenuItem
                  key={course.id}
                  value={course.id}
                  sx={{ fontFamily: "Roboto" }}
                >
                  {course.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleEnroll}
          disabled={!selectedCourseId}
          sx={{
            fontFamily: "Roboto",
            backgroundColor: !selectedCourseId ? "white" : "primary.main",
            color: !selectedCourseId ? "gray" : "white",
            "&.Mui-disabled": {
              color: "gray",
              backgroundColor: "white",
            },
          }}
        >
          {selectedCourseId ? "Enroll" : "Select a course"}
        </Button>
      </Stack>
    </Box>
  );
}
