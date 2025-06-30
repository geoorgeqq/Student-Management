import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
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
import "./../CalendarStyle.css";

interface TimeTableContentProps {
  selectedContent: string;
  type: string | undefined;
  studentId?: string; // Optional studentId prop for student or teacher type
}

interface Schedule {
  id: number;
  course: {
    id: number;
    courseName: string;
    teacher: { name: string };
    location: string;
  };
  startTime: string;
  endTime: string;
  dayOfWeek: string;
  isActive: boolean;
  daysOfWeek?: string;
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
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const jwtToken = localStorage.getItem("jsonWebToken");

  useEffect(() => {
    console.log(type);
    if (studentId) {
      if (type === "student") {
        // Fetch student schedules
        axios
          .get(`http://localhost:8080/schedules/${studentId}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then((response) => {
            setSchedules(response.data);
            console.log(response.data);
          });
      } else if (type === "teacher") {
        // Fetch teacher schedules
        axios
          .get(`http://localhost:8080/courses/teachers/${studentId}`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            setSchedules(response.data);
            console.log(response.data);
          });
      }
    }
  }, [type, studentId]);

  // Helper to safely get a date for a day and time
  const safeGetDateForDay = (day: string, time: string) => {
    if (!day || !time) return null;
    const today = new Date();
    const dayIdx = dayMap[day];
    if (typeof dayIdx !== 'number') return null;
    const dayDiff = dayIdx - today.getDay();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + dayDiff);
    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    targetDate.setHours(hours, minutes, 0, 0);
    return targetDate;
  };

  // Support both dayOfWeek and daysOfWeek (comma-separated)
  const events = schedules.flatMap((schedule: Schedule) => {
    const days = schedule.daysOfWeek
      ? schedule.daysOfWeek.split(',').map(d => d.trim()).filter(Boolean)
      : schedule.dayOfWeek
        ? [schedule.dayOfWeek]
        : [];
    return days.map((day) => {
      const startDate = safeGetDateForDay(day, schedule.startTime);
      const endDate = safeGetDateForDay(day, schedule.endTime);
      return {
        id: `${schedule.id}-${day}`,
        title: `${schedule.course.courseName} - ${schedule.course.teacher.name}`,
        start: startDate ? startDate.toISOString() : undefined,
        rrule: startDate
          ? {
              freq: "weekly",
              byweekday: [dayMap[day]],
              dtstart: startDate.toISOString(),
              until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            }
          : undefined,
        duration: "02:00",
        extendedProps: {
          courseId: schedule.course.id,
          courseName: schedule.course.courseName,
          teacherName: schedule.course.teacher.name,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          location: schedule.course.location,
        },
      };
    });
  });

  const handleEventClick = (clickInfo: any) => {
    const courseId = clickInfo.event.extendedProps.courseId;

    axios
      .get(`http://localhost:8080/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        setSelectedCourse(response.data);
        setDialogOpen(true);
      });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const renderEventContent = (eventInfo: any) => {
    const { extendedProps } = eventInfo.event;
    return (
      <div className="eventClass">
        <div
          style={{
            fontWeight: "bold",
          }}
        >
          {extendedProps.courseName}
        </div>
        <div>{extendedProps.location}</div>
        {type === "student" && (
          <div className="teacher-name">{extendedProps.teacherName}</div>
        )}
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
          eventContent={renderEventContent}
          eventClick={handleEventClick}
        />
      </Stack>

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
