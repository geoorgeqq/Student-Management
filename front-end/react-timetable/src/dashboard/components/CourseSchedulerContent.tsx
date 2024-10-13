import React, { useEffect, useState } from "react";
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import Header from "./Header";

interface CourseSchedulerContentProps {
  selectedContent: string;
  type: string | undefined; // Type prop
}

interface Schedule {
  id: number;
  course: {
    id: number;
    courseName: string;
    teacher: { name: string }; // Added teacher name
  };
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  isActive: boolean;
}

interface Course {
  id: number;
  courseName: string;
}

interface NewSchedule {
  courseId: number;
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  isActive: boolean;
}

export default function CourseSchedulerContent({
  selectedContent,
  type,
}: CourseSchedulerContentProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(
    null
  );

  const initialNewSchedule = {
    courseId: 0,
    startTime: "",
    endTime: "",
    dayOfWeek: "",
    isActive: true,
  };

  const [newSchedule, setNewSchedule] =
    useState<NewSchedule>(initialNewSchedule);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fetch schedules based on user type
  useEffect(() => {
    axios.get("http://localhost:8080/schedules").then((response) => {
      setSchedules(response.data);
    });
  }, []);

  useEffect(() => {
    if (type === "admin") {
      axios.get("http://localhost:8080/courses").then((response) => {
        setCourses(response.data);
      });
    }
  }, [type]);

  // Handle form field change
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // Automatically set endTime 2 hours after startTime
  const handleStartTimeChange = (newValue: Dayjs | null) => {
    const startTime = newValue ? newValue.format("HH:mm") : "";
    // Calculate the endTime by adding 2 hours to startTime
    if (startTime) {
      const [hours, minutes] = startTime.split(":");
      let newHours = parseInt(hours) + 2;
      if (newHours >= 24) newHours = newHours - 24; // Handle cases where hours exceed 24
      const endTime = `${newHours.toString().padStart(2, "0")}:${minutes}`;
      setNewSchedule((prev) => ({ ...prev, startTime, endTime }));
    } else {
      setNewSchedule((prev) => ({ ...prev, startTime, endTime: "" }));
    }
  };

  // Open dialog for editing by clicking a row
  const handleRowClick = (schedule: Schedule) => {
    setIsEditing(true);
    setEditingScheduleId(schedule.id);
    setNewSchedule({
      courseId: schedule.course.id,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      dayOfWeek: schedule.dayOfWeek,
      isActive: schedule.isActive,
    });
    setOpenDialog(true);
  };

  // Open dialog for adding new schedule
  const handleAddNew = () => {
    setIsEditing(false);
    setEditingScheduleId(null);
    setNewSchedule(initialNewSchedule);
    setOpenDialog(true);
  };

  // Close the dialog
  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewSchedule(initialNewSchedule);
  };

  // Handle Snackbar close
  const handleAddSchedule = () => {
    axios
      .post("http://localhost:8080/schedules", newSchedule)
      .then((response) => {
        setSchedules([...schedules, response.data]);
        handleDialogClose();
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 409) {
            // Check for HTTP 409 Conflict
            const errorMessage =
              error.response.data.error ||
              "A course schedule already exists for this time period.";
            setSnackbarMessage(errorMessage);
            setSnackbarOpen(true);
          } else {
            console.error("Unexpected error", error);
          }
        }
      });
  };

  // Update existing schedule (PUT request)
  const handleUpdateSchedule = () => {
    if (editingScheduleId !== null) {
      axios
        .put(
          `http://localhost:8080/schedules/${editingScheduleId}`,
          newSchedule
        )
        .then((response) => {
          const updatedSchedules = schedules.map((schedule) =>
            schedule.id === editingScheduleId ? response.data : schedule
          );
          setSchedules(updatedSchedules);
          handleDialogClose();
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 409) {
              // Check for HTTP 409 Conflict
              const errorMessage =
                error.response.data.error ||
                "A course schedule already exists for this time period.";
              setSnackbarMessage(errorMessage);
              setSnackbarOpen(true);
            } else {
              console.error("Unexpected error", error);
            }
          }
        });
    }
  };

  // Function to handle Snackbar close event
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  // Delete existing schedule (DELETE request)
  const handleDeleteSchedule = () => {
    if (editingScheduleId !== null) {
      axios
        .delete(`http://localhost:8080/schedules/${editingScheduleId}`)
        .then(() => {
          const updatedSchedules = schedules.filter(
            (schedule) => schedule.id !== editingScheduleId
          );
          setSchedules(updatedSchedules);
          handleDialogClose();
        })
        .catch((error) => {
          console.error("Error deleting schedule", error);
        });
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  // Conditional rendering based on user type

  // Admin view logic
  if (type === "admin") {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: "auto",
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: "center",
              mx: 3,
              pb: 10,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header selectedContent={selectedContent} />
            {/* Schedule Table for Admin */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Course</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell>Day of Week</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow
                      key={schedule.id}
                      onClick={() => handleRowClick(schedule)}
                      style={{ cursor: "pointer" }}
                    >
                      <TableCell>{schedule.course.courseName}</TableCell>
                      <TableCell>{formatTime(schedule.startTime)}</TableCell>
                      <TableCell>{formatTime(schedule.endTime)}</TableCell>
                      <TableCell>{schedule.dayOfWeek}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleRowClick(schedule)}>
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="outlined" onClick={handleAddNew}>
              Add New Schedule
            </Button>

            {/* Add/Edit Schedule Dialog */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
              <DialogTitle>
                {isEditing ? "Edit Schedule" : "Add Schedule"}
              </DialogTitle>
              <DialogContent>
                {/* Course Selection Dropdown */}
                {type === "admin" && (
                  <TextField
                    select
                    label="Course"
                    margin="dense"
                    name="courseId"
                    value={newSchedule.courseId}
                    onChange={handleFieldChange}
                    fullWidth
                  >
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.courseName}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                {/* Start Time Field */}
                <TimeField
                  margin="dense"
                  label="Start Time"
                  name="startTime"
                  format="HH:mm"
                  value={
                    newSchedule.startTime
                      ? dayjs(`1970-01-01T${newSchedule.startTime}:00`)
                      : null
                  }
                  onChange={handleStartTimeChange}
                  fullWidth
                />

                {/* End Time Field */}
                <TimeField
                  margin="dense"
                  label="End Time"
                  name="endTime"
                  format="HH:mm"
                  value={
                    newSchedule.endTime
                      ? dayjs(`1970-01-01T${newSchedule.endTime}:00`)
                      : null
                  }
                  onChange={(newValue) => {
                    setNewSchedule((prev) => ({
                      ...prev,
                      endTime: newValue?.format("HH:mm") || "",
                    }));
                  }}
                  fullWidth
                  disabled // Automatically calculated
                />

                {/* Day of Week Field */}
                <TextField
                  margin="dense"
                  label="Day of Week"
                  name="dayOfWeek"
                  fullWidth
                  variant="outlined"
                  value={newSchedule.dayOfWeek}
                  onChange={handleFieldChange}
                />
              </DialogContent>

              {/* Dialog Actions */}
              <DialogActions>
                <Button onClick={handleDialogClose}>Cancel</Button>
                <Button
                  onClick={isEditing ? handleUpdateSchedule : handleAddSchedule}
                >
                  {isEditing ? "Update" : "Add"}
                </Button>

                {/* Delete Button (Visible only when editing) */}
                {isEditing && (
                  <Button onClick={handleDeleteSchedule} color="error">
                    Delete
                  </Button>
                )}
              </DialogActions>
            </Dialog>

            {/* Snackbar for Error Messages */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={handleSnackbarClose}
                severity="error"
                sx={{ width: "100%" }}
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </Stack>
        </Box>
      </LocalizationProvider>
    );
  }
  return null;
}
