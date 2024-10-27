import {
  Box,
  alpha,
  Stack,
  Typography,
  Avatar,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import Header from "./Header";
import * as React from "react";
import { useState, useEffect } from "react";

interface SettingsContentProps {
  selectedContent: string;
  id: string;
  image: string;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  setId: React.Dispatch<React.SetStateAction<string>>;
  setDepartmentId: React.Dispatch<React.SetStateAction<string>>;
  type: string | undefined;
}

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

interface Student {
  id: number;
  name: string;
  email: string;
  dateOfBirth: string; // YYYY-MM-DD format expected by the input
  department: Department;
  pic: string;
}

export default function SettingsContent({
  selectedContent,
  id,
  image,
  name,
  setName,
  setEmail,
  setImage,
  setId,
  setDepartmentId,
  type,
}: SettingsContentProps) {
  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingStudent, setLoadingStudent] = useState<boolean>(true);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Editable fields state
  const [editName, setEditName] = useState<string>(name);
  const [editEmail, setEditEmail] = useState<string>("");
  const [editDateOfBirth, setEditDateOfBirth] = useState<string>(""); // Store in DD-MM-YYYY format
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const jwtToken = localStorage.getItem("jsonWebToken");

  // Fetch student data based on id
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`http://localhost:8080/${type}/${id}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }
        const data = await response.json();
        setStudent(data);

        // Initialize form fields
        setEditName(data.name);
        setEditEmail(data.email);
        setEditDateOfBirth(formatDate(data.dateOfBirth)); // Format from YYYY-MM-DD to DD-MM-YYYY
        setId(data.id);
        setDepartmentId(data.department.id);
      } catch (error) {
        setError("Failed to fetch student data");
      } finally {
        setLoadingStudent(false);
      }
    };

    fetchStudent();
  }, [id, setId, setDepartmentId]);

  // Fetch student courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/student/enrolled/${id}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (!response.ok) {
          if (response.status === 404) {
            setCourses([]);
            return;
          }
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        setError("Failed to fetch courses");
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [id]);

  const handleSave = async () => {
    // Convert DD-MM-YYYY to YYYY-MM-DD for submission
    const [day, month, year] = editDateOfBirth.split("-");
    const dateOfBirthForSubmission = `${year}-${month}-${day}`;

    // Build the updated student object
    const updatedStudent: Partial<Student> = {
      ...student,
      name: editName,
      email: editEmail,
      dateOfBirth: dateOfBirthForSubmission, // Send in YYYY-MM-DD format
    };

    // Handle image upload (if a new one was selected)
    let imageUrl: string = image;

    // Update student picture based on the image URL or base64 data
    if (imageUrl.startsWith("data:")) {
      // Extract the base64 part from the data URL
      const base64Image = imageUrl.split(",")[1];
      updatedStudent.pic = base64Image; // Store only the base64 string
    } else {
      updatedStudent.pic = imageUrl; // Use the image URL directly
    }

    // Send updated data to the server
    try {
      const response = await fetch(`http://localhost:8080/${type}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedStudent),
      });

      // Check if the response is OK and then parse it
      if (!response.ok) {
        throw new Error("Failed to update student data");
      } else {
        const responseData = await response.json(); // Parse response to JSON

        // Assuming responseData contains both jwtToken and user details
        const { jwtToken: newJwtToken } = responseData;
        localStorage.setItem("jsonWebToken", responseData.jwtToken);

        // Show a success message based on the type
        if (type === "student") {
          alert(`Student profile updated successfully!`);
        } else {
          alert(`Teacher profile updated successfully!`);
        }

        // Update the parent state with new values
        setName(editName);
        setEmail(editEmail);
        setImage(imageUrl);
      }
    } catch (error) {
      alert("Error updating student data");
    }
  };

  // Handle image change event
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedImage(file); // Update the selected image file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string); // Update the image preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Format date from YYYY-MM-DD to DD-MM-YYYY for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Format: DD-MM-YYYY
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;
    const [year, month, day] = dateValue.split("-");
    setEditDateOfBirth(`${day}-${month}-${year}`); // Store in DD-MM-YYYY format
  };

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

  // Handle loading for courses
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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 3,
            mx: 3,
            p: 3,
            width: "100%",
            borderRadius: 2,
            boxShadow: 2,
            bgcolor: "background.paper",
          }}
        >
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="upload-image"
            onChange={handleImageChange}
          />
          <label
            htmlFor="upload-image"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              alt="Profile Picture"
              src={image || "/path-to-your-profile-picture.jpg"}
              sx={{
                width: 120,
                height: 120,
                mb: 1,
                border: "4px solid",
                borderColor: "primary.main",
                cursor: "pointer",
              }}
            />
            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "gray",
                fontFamily: "Roboto, sans-serif",
                mb: 5,
              }}
            >
              Click on the photo to change it
            </Typography>
          </label>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            sx={{
              mb: 2,
            }}
            InputProps={{
              sx: {
                fontFamily: "Roboto, sans-serif", // Set font for the input text
              },
            }}
            InputLabelProps={{
              sx: {
                fontFamily: "Roboto, sans-serif", // Set font for the label
              },
            }}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            sx={{
              mb: 2,
            }}
            InputProps={{
              sx: {
                fontFamily: "Roboto, sans-serif", // Set font for the input text
              },
            }}
            InputLabelProps={{
              sx: {
                fontFamily: "Roboto, sans-serif", // Set font for the label
              },
            }}
          />
          {type === "student" && (
            <TextField
              label="Date of Birth"
              type="date"
              variant="outlined"
              fullWidth
              value={editDateOfBirth.split("-").reverse().join("-")} // Convert DD-MM-YYYY back to YYYY-MM-DD for input
              onChange={handleDateChange} // Updates the state in the correct format
              sx={{ mb: 2 }}
              InputProps={{
                sx: {
                  fontFamily: "Roboto, sans-serif", // Set font for the input text
                },
              }}
              InputLabelProps={{
                sx: {
                  fontFamily: "Roboto, sans-serif", // Set font for the label
                },
              }}
            />
          )}

          <Typography
            variant="body1"
            component="div"
            sx={{
              fontFamily: "Roboto, sans-serif",
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
                sx={{
                  fontFamily: "Roboto, sans-serif",
                  mb: 2,
                  fontWeight: "bold",
                }}
              >
                Enrolled Courses:
              </Typography>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexDirection: "column",
                  p: 2,
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
                          sx={{ fontFamily: "Roboto, sans-serif" }}
                        >
                          {course.courseName}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Roboto, sans-serif",
                      mb: 3,
                      textAlign: "center",
                    }}
                  >
                    No courses enrolled.
                  </Typography>
                )}
              </Box>
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{ mt: 3, fontFamily: "Roboto, sans-serif" }}
          >
            Save
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
