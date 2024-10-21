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
  FormControl,
  InputLabel,
  Select,
  AlertColor,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import Header from "./Header";
import { SelectChangeEvent } from "@mui/material";

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
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<AlertColor>("success");

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

  const times = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // Automatically set endTime 2 hours after startTime

  const handleStartTimeChange = (event: SelectChangeEvent<string>) => {
    const startTime = event.target.value as string;

    if (startTime) {
      const [hours, minutes] = startTime.split(":").map(Number);
      let newHours = hours + 2;
      if (newHours >= 24) newHours -= 24;
      const endTime = `${newHours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;

      setNewSchedule((prev) => ({
        ...prev,
        startTime, // Directly set startTime as the selected string
        endTime,
      }));
    } else {
      setNewSchedule((prev) => ({ ...prev, startTime: "", endTime: "" }));
    }
  };

  // Open dialog for editing by clicking a row
  const handleRowClick = (schedule: Schedule) => {
    setIsEditing(true);
    setEditingScheduleId(schedule.id);

    const formattedStartTime = schedule.startTime.slice(0, 5); // Trim to HH:mm
    const formattedEndTime = schedule.endTime.slice(0, 5); // Trim to HH:mm

    setNewSchedule({
      courseId: schedule.course.id,
      startTime: formattedStartTime, // Set the trimmed time for the Select component
      endTime: formattedEndTime,
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
        const scheduleMessage = "Course scheduled succesfully!";
        setSnackbarMessage(scheduleMessage);
        setSnackbarOpen(true);
        setSnackbarSeverity("success");
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
            setSnackbarSeverity("error");
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
          const scheduleMessage = "Course scheduled succesfully!";
          setSnackbarMessage(scheduleMessage);
          setSnackbarOpen(true);
          setSnackbarSeverity("success");
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
                <FormControl fullWidth margin="dense">
                  <InputLabel id="start-time-label">Start Time</InputLabel>
                  <Select
                    labelId="start-time-label"
                    value={newSchedule.startTime}
                    onChange={handleStartTimeChange}
                    label="Start Time"
                    displayEmpty
                  >
                    {times.map((time) => (
                      <MenuItem key={time} value={time}>
                        {time}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

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
                severity={snackbarSeverity}
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
