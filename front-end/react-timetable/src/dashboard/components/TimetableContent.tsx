import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule"; // Import rrule plugin for recurring events
import Header from "./Header";
import {
  alpha,
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.css";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import "./../CalendarStyle.css"; // Ensure your CSS file is imported

interface TimeTableContentProps {
  selectedContent: string;
  type: string | undefined;
  studentId?: string; // Optional studentId prop for student type
}

interface Schedule {
  id: number;
  course: {
    id: number;
    courseName: string;
    teacher: { name: string }; // Added teacher name
  };
  startTime: string; // e.g. "09:00:00"
  endTime: string; // e.g. "11:00:00"
  dayOfWeek: string; // e.g. "Monday"
  isActive: boolean;
}

interface Course {
  id: number;
  courseName: string;
  description: string;
  location: string;
}

export default function TimeTableContent({
  selectedContent,
  type,
  studentId,
}: TimeTableContentProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false); // Control dialog open state
  const calendarRef = useRef<FullCalendar | null>(null);

  const dayMap: { [key: string]: number } = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };

  useEffect(() => {
    if (studentId) {
      axios
        .get(`http://localhost:8080/schedules/${studentId}`)
        .then((response) => {
          setSchedules(response.data);
          console.log(response.data);
        });
    }
  }, [type, studentId]);

  const getDateForDay = (dayOfWeek: string, time: string) => {
    const today = new Date();
    const dayDiff = dayMap[dayOfWeek] - today.getDay();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayDiff);

    // Split time into hours and minutes, and ensure time is set correctly
    const [hours, minutes] = time.split(":").map(Number); // Convert to numbers
    targetDate.setHours(hours, minutes, 0, 0); // Set hours, minutes, and zero seconds
    return targetDate; // Return the JavaScript date object itself, not a string
  };

  const events = schedules.map((schedule: Schedule) => {
    const startDate = getDateForDay(schedule.dayOfWeek, schedule.startTime);
    const endDate = getDateForDay(schedule.dayOfWeek, schedule.endTime);

    return {
      id: schedule.id.toString(),
      title: `${schedule.course.courseName} - ${schedule.course.teacher.name}`,
      start: startDate.toISOString(),
      rrule: {
        freq: "weekly",
        byweekday: [dayMap[schedule.dayOfWeek]],
        dtstart: startDate.toISOString(),
        until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Recurring until next year
      },
      duration: "02:00",
      extendedProps: {
        courseId: schedule.course.id, // Add courseId for fetching course details
        courseName: schedule.course.courseName,
        teacherName: schedule.course.teacher.name,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
      },
    };
  });

  // Fetch course details and open dialog
  const handleEventClick = (clickInfo: any) => {
    const courseId = clickInfo.event.extendedProps.courseId;

    axios.get(`http://localhost:8080/courses/${courseId}`).then((response) => {
      setSelectedCourse(response.data); // Set course details
      setDialogOpen(true); // Open dialog
    });
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Custom rendering for events
  const renderEventContent = (eventInfo: any) => {
    const { extendedProps } = eventInfo.event;
    return (
      <div>
        <div style={{ fontWeight: "bold" }}>
          {extendedProps.courseName} {/* Only display the course name */}
        </div>
        <div className="teacher-name">{extendedProps.teacherName}</div>{" "}
        {/* Display the teacher name */}
      </div>
    );
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

        <FullCalendar
          ref={calendarRef}
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            rrulePlugin,
            bootstrap5Plugin,
          ]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          timeZone="local"
          events={events}
          allDaySlot={false}
          height="auto"
          slotMinTime="09:00:00"
          slotMaxTime="19:00:01"
          eventContent={renderEventContent} // Use custom rendering for events
          eventClick={handleEventClick} // Handle event clicks
        />
      </Stack>

      {/* Dialog for course details */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Course Details</DialogTitle>
        <DialogContent>
          {selectedCourse ? (
            <>
              <DialogContentText>
                <strong>Course Name:</strong> {selectedCourse.courseName}
              </DialogContentText>
              <DialogContentText>
                <strong>Description:</strong> {selectedCourse.description}
              </DialogContentText>
              <DialogContentText>
                <strong>Location:</strong> {selectedCourse.location}
              </DialogContentText>
            </>
          ) : (
            <DialogContentText>Loading...</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
