import React from "react";
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
} from "@mui/material";
import axios from "axios";

interface AdminCourse {
  id: number;
  courseName: string;
  enrollment: any[];
  department: { id: number; department_name: string };
}

interface EditCourseModalProps {
  open: boolean;
  onClose: () => void;
  courseId: number;
  existingCourseName: string;
  existingDepartmentId: string;
  departments: { id: number; department_name: string }[];
  onCourseUpdated: (updatedCourse: AdminCourse) => void; // Updated type
  onCourseDeleted: (courseId: number) => void; // Callback for deleted course
}

const EditCourseModal: React.FC<EditCourseModalProps> = ({
  open,
  onClose,
  courseId,
  existingCourseName,
  existingDepartmentId,
  departments,
  onCourseUpdated,
  onCourseDeleted,
}) => {
  const [courseName, setCourseName] = React.useState(existingCourseName);
  const [departmentId, setDepartmentId] = React.useState(existingDepartmentId);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8080/courses/${courseId}`,
        {
          courseName,
          departmentId,
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
      // You may want to inform the parent component to remove the deleted course from the list
      onCourseDeleted(courseId); // Notify parent about deletion
      onClose(); // Close the modal after deletion
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
