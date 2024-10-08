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
} from "@mui/material";
import { useEffect, useState } from "react";
import Header from "./Header";
import axios from "axios";

interface CourseSchedulerContentProps {
  selectedContent: string;
}

interface Schedule {
  id: number;
  course: { id: number; courseName: string };
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  recurrenceType: string;
  dayOfWeek: string;
  interval: number;
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
  startDate: string;
  endDate: string;
  recurrenceType: string;
  dayOfWeek: string;
  interval: number;
  isActive: boolean;
}

const recurrenceTypes = ["DAILY", "WEEKLY", "MONTHLY"];

export default function CourseSchedulerContent({
  selectedContent,
}: CourseSchedulerContentProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track if editing
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(
    null
  ); // ID of schedule being edited

  const initialNewSchedule = {
    courseId: 0,
    startTime: "",
    endTime: "",
    startDate: "",
    endDate: "",
    recurrenceType: "DAILY",
    dayOfWeek: "",
    interval: 1,
    isActive: true,
  };

  const [newSchedule, setNewSchedule] =
    useState<NewSchedule>(initialNewSchedule);

  // Fetch schedules from the backend
  useEffect(() => {
    axios.get("http://localhost:8080/schedules").then((response) => {
      setSchedules(response.data);
    });
  }, []);

  // Fetch courses from the backend
  useEffect(() => {
    axios.get("http://localhost:8080/courses").then((response) => {
      setCourses(response.data);
    });
  }, []);

  // Handle form field change
  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({ ...prev, [name]: value }));
  };

  // Open dialog for editing by clicking a row
  const handleRowClick = (schedule: Schedule) => {
    setIsEditing(true);
    setEditingScheduleId(schedule.id);
    setNewSchedule({
      courseId: schedule.course.id,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      recurrenceType: schedule.recurrenceType,
      dayOfWeek: schedule.dayOfWeek,
      interval: schedule.interval,
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

  // Submit new schedule
  const handleAddSchedule = () => {
    axios
      .post("http://localhost:8080/schedules", newSchedule)
      .then((response) => {
        setSchedules([...schedules, response.data]);
        handleDialogClose();
      })
      .catch((error) => {
        console.error("Error adding schedule", error);
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
          console.error("Error updating schedule", error);
        });
    }
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

  return (
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

        {/* Schedule Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Recurrence Type</TableCell>
                <TableCell>Day of Week</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow
                  key={schedule.id}
                  hover
                  onClick={() => handleRowClick(schedule)} // Click row to edit
                  style={{ cursor: "pointer" }} // Add pointer cursor on hover
                >
                  <TableCell>{schedule.course.courseName}</TableCell>
                  <TableCell>{schedule.startTime}</TableCell>
                  <TableCell>{schedule.endTime}</TableCell>
                  <TableCell>{schedule.startDate}</TableCell>
                  <TableCell>{schedule.endDate}</TableCell>
                  <TableCell>{schedule.recurrenceType}</TableCell>
                  <TableCell>{schedule.dayOfWeek}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Schedule Button */}
        <Button variant="contained" onClick={handleAddNew}>
          Add New Schedule
        </Button>

        {/* Add/Edit Schedule Dialog */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>
            {isEditing ? "Edit Course Schedule" : "Add New Course Schedule"}
          </DialogTitle>
          <DialogContent>
            {/* Course ID Dropdown */}
            <TextField
              margin="dense"
              label="Course"
              name="courseId"
              select
              fullWidth
              variant="outlined"
              value={newSchedule.courseId}
              onChange={handleFieldChange}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.courseName}
                </MenuItem>
              ))}
            </TextField>

            {/* Other Fields */}
            <TextField
              margin="dense"
              label="Start Time"
              name="startTime"
              type="time"
              fullWidth
              variant="outlined"
              value={newSchedule.startTime}
              onChange={handleFieldChange}
            />
            <TextField
              margin="dense"
              label="End Time"
              name="endTime"
              type="time"
              fullWidth
              variant="outlined"
              value={newSchedule.endTime}
              onChange={handleFieldChange}
            />
            <TextField
              margin="dense"
              label="Start Date"
              name="startDate"
              type="date"
              fullWidth
              variant="outlined"
              value={newSchedule.startDate}
              onChange={handleFieldChange}
            />
            <TextField
              margin="dense"
              label="End Date"
              name="endDate"
              type="date"
              fullWidth
              variant="outlined"
              value={newSchedule.endDate}
              onChange={handleFieldChange}
            />
            <TextField
              margin="dense"
              label="Recurrence Type"
              name="recurrenceType"
              select
              fullWidth
              variant="outlined"
              value={newSchedule.recurrenceType}
              onChange={handleFieldChange}
            >
              {recurrenceTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              label="Day of Week"
              name="dayOfWeek"
              fullWidth
              variant="outlined"
              value={newSchedule.dayOfWeek}
              onChange={handleFieldChange}
            />
            <TextField
              margin="dense"
              label="Interval"
              name="interval"
              type="number"
              fullWidth
              variant="outlined"
              value={newSchedule.interval}
              onChange={handleFieldChange}
            />
          </DialogContent>
          <DialogActions>
            {/* Cancel and Save Buttons */}
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
      </Stack>
    </Box>
  );
}
