import { Box, alpha, Stack, Typography, Avatar, Divider } from "@mui/material";
import Header from "./Header";
import { useState, useEffect } from "react";

interface MyAccountContentProps {
  selectedContent: string;
  id: string;
  image: string;
  type: string | undefined;
}

interface Course {
  id: number;
  courseName: string;
  enrollment: any[]; // Adjust based on what enrollment data contains
}

interface Department {
  id: number;
  department_name: string;
  courses: Course[];
}

interface Student {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string;
  department: Department;
}

export default function MyAccountContent({
  selectedContent,
  id,
  image,
  type,
}: MyAccountContentProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingStudent, setLoadingStudent] = useState<boolean>(true);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the student data using the provided id
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:8080/${type}/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const data = await response.json();
        setStudent(data); // Update state with the fetched student data
      } catch (error) {
        setError("Failed to fetch student data");
      } finally {
        setLoadingStudent(false); // Set loading to false once the data is fetched or an error occurs
      }
    };

    fetchStudent(); // Call the fetch function
  }, [id]);

  // Fetch the courses for the student using the provided id
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/courses/students/${id}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            setCourses([]); // Set courses to an empty array if no courses found
            return; // Exit early for 404
          }
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data); // Update state with the fetched courses
      } catch (error) {
        setError("Failed to fetch courses");
      } finally {
        setLoadingCourses(false); // Set loading to false once the data is fetched or an error occurs
      }
    };

    fetchCourses(); // Call the fetch function
  }, [id]);

  // Handle loading and error states for student
  if (loadingStudent) {
    return <p>Loading student data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!student) {
    return <p>No student data found</p>;
  }

  // Handle loading and error states for courses
  if (loadingCourses) {
    return <p>Loading courses...</p>;
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 3,
            mx: 3,
            p: 3, // Padding around profile info
            width: "100%",
            borderRadius: 2,
            boxShadow: 2, // Adds shadow around the profile card
            bgcolor: "background.paper", // Sets background color
          }}
        >
          <Avatar
            alt="Profile Picture"
            src={image || "/path-to-your-profile-picture.jpg"}
            sx={{
              width: 120,
              height: 120,
              mb: 2,
              border: "4px solid",
              borderColor: "primary.main",
            }} // Adds border
          />
          <Typography
            variant="h4"
            component="div"
            sx={{ fontFamily: "Roboto", mb: 2, textAlign: "center" }}
          >
            {student.name}
          </Typography>
          <Typography
            variant="body1"
            component="div"
            sx={{ fontFamily: "Roboto", mb: 2, textAlign: "center" }}
          >
            {student.email}
          </Typography>
          {type === "student" && (
            <Typography
              variant="body2"
              component="div"
              sx={{ fontFamily: "Roboto", mb: 2, textAlign: "center" }}
            >
              {new Date(student.dateOfBirth).toLocaleDateString()}
            </Typography>
          )}
          <Typography
            variant="body1"
            component="div"
            sx={{
              fontFamily: "Roboto",
              mb: 2,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Department: {student.department.department_name}
          </Typography>
          {type === "student" && <Divider sx={{ my: 3 }} />}
          {type === "student" && (
            <Box sx={{ width: "100%" }}>
              <Typography
                variant="body1"
                component="div"
                sx={{ fontFamily: "Roboto", mb: 2, fontWeight: "bold" }}
              >
                Enrolled Courses:
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start", // Align items to the start vertically
                  flexDirection: "column", // Stack elements vertically
                  p: 2, // Padding for the Box
                }}
              >
                {courses.length > 0 ? (
                  <Stack spacing={2} sx={{ width: "100%" }}>
                    {courses.map((course) => (
                      <Box
                        key={course.id}
                        sx={{
                          p: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 1,
                          bgcolor: "background.default",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "Roboto" }}
                        >
                          {course.courseName}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: "Roboto", mb: 3, textAlign: "center" }}
                  >
                    No courses enrolled.
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
