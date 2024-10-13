import {
  Box,
  alpha,
  Stack,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import Header from "./Header";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface TimeTableContentProps {
  selectedContent: string;
  type: string | undefined; // Type prop
  studentId?: string; // Optional studentId prop for student type
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

export default function TimeTableContent({
  selectedContent,
  type,
  studentId, // Receive studentId as prop
}: TimeTableContentProps) {
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
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (studentId) {
      axios
        .get(`http://localhost:8080/schedules/${studentId}`)
        .then((response) => {
          setSchedules(response.data);
        });
    }
  }, [type, studentId]);

  // Fetch courses for admin
  useEffect(() => {
    if (type === "admin") {
      axios.get("http://localhost:8080/courses").then((response) => {
        setCourses(response.data);
      });
    }
  }, [type]);

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
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

        {/* Student Schedule Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell>Day of Week</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule: Schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.course.courseName}</TableCell>
                  <TableCell>{schedule.course.teacher.name}</TableCell>
                  {/* Displaying Start Time as HH:mm */}
                  <TableCell>{formatTime(schedule.startTime)}</TableCell>
                  {/* Displaying End Time as HH:mm */}
                  <TableCell>{formatTime(schedule.endTime)}</TableCell>
                  <TableCell>{schedule.dayOfWeek}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Box>
  );
}
