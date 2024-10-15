import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextareaAutosize,
} from "@mui/material";
import axios from "axios";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  textarea: {
    height: "100%",
    width: "100%",
    fontSize: "16px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid rgba(0, 0, 0, 0.23)",
    backgroundColor: "#05070a",
    marginTop: "0.3rem",
    color: "white",
    "&::placeholder": {
      color: "#929eb6",
    },
  },
});

interface AdminCourse {
  id: number;
  courseName: string;
  enrollment: any[];
  department: { id: number; department_name: string };
  description: string;
  location: string;
  teacher: {
    id: string;
    name: string;
  };
}

interface EditCourseModalProps {
  open: boolean;
  onClose: () => void;
  courseId: number;
  existingCourseName: string;
  existingDepartmentId: string;
  existingCourseDescription: string;
  existingTeacherId: string;
  existingCourseLocation: string;
  departments: { id: number; department_name: string }[];
  onCourseUpdated: (updatedCourse: AdminCourse) => void;
  onCourseDeleted: (courseId: number) => void;
}

interface Teacher {
  id: number;
  name: string;
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  open,
  onClose,
  courseId,
  existingCourseName,
  existingDepartmentId,
  existingCourseDescription,
  existingCourseLocation,
  existingTeacherId,
  departments,
  onCourseUpdated,
  onCourseDeleted,
}) => {
  const classes = useStyles();
  console.log(existingTeacherId);

  // Set up state variables
  const [courseName, setCourseName] = React.useState("");
  const [courseDescription, setCourseDescription] = React.useState("");
  const [departmentId, setDepartmentId] = React.useState("");
  const [courseLocation, setCourseLocation] = React.useState("");
  const [courseTeacherId, setCourseTeacherId] = React.useState("");
  const [teachers, setTeachers] = React.useState([]);

  // Fetch teachers when department changes
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/teachers/departments/${departmentId}`
        );
        setTeachers(response.data); // Assuming response.data is an array of teachers
      } catch (error) {
        console.error("Failed to fetch teachers", error);
      }
    };

    if (departmentId) {
      fetchTeachers();
    }
  }, [departmentId]);

  // Update state when modal opens
  useEffect(() => {
    if (open) {
      // Only update state if modal is open
      setCourseName(existingCourseName);
      setCourseDescription(existingCourseDescription);
      setDepartmentId(existingDepartmentId);
      setCourseLocation(existingCourseLocation);
      setCourseTeacherId(existingTeacherId);
    } else {
      // Reset state when modal closes
      setCourseName("");
      setCourseDescription("");
      setDepartmentId("");
      setCourseLocation("");
      setCourseTeacherId("");
      setTeachers([]);
    }
  }, [
    open,
    existingCourseName,
    existingCourseDescription,
    existingDepartmentId,
    existingCourseLocation,
    existingTeacherId,
  ]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/courses/${courseId}`,
        {
          courseName,
          departmentId,
          description: courseDescription,
          location: courseLocation,
          teacherId: courseTeacherId,
        }
      );
      onCourseUpdated(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to update course", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/courses/${courseId}`);
      onCourseDeleted(courseId);
      onClose();
    } catch (error) {
      console.error("Failed to delete course", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Course</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Course Name"
          type="text"
          fullWidth
          variant="outlined"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <TextareaAutosize
          minRows={3}
          placeholder="Description"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          className={classes.textarea}
        />
        <TextField
          margin="dense"
          label="Location"
          type="text"
          fullWidth
          variant="outlined"
          value={courseLocation}
          onChange={(e) => setCourseLocation(e.target.value)}
        />
        <FormControl fullWidth variant="outlined" margin="dense">
          <InputLabel id="department-select-label">Department</InputLabel>
          <Select
            labelId="department-select-label"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            label="Department"
          >
            {departments.map((department) => (
              <MenuItem key={department.id} value={department.id.toString()}>
                {department.department_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="outlined" margin="dense">
          <InputLabel id="teacher-select-label">Teacher</InputLabel>
          <Select
            labelId="teacher-select-label"
            value={courseTeacherId}
            onChange={(e) => setCourseTeacherId(e.target.value)}
            label="Teacher"
          >
            {teachers.map((teacher: Teacher) => (
              <MenuItem key={teacher.id} value={teacher.id}>
                {teacher.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Update
        </Button>
        <Button onClick={handleDelete} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCourseModal;
