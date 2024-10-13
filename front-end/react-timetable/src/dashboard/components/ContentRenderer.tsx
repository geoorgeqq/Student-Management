import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Header from "./Header";
import MainGrid from "./MainGrid";
import CoursesContent from "./CoursesContent";
import EnrollCourse from "./EnrollCourse";
import MyAccountContent from "./MyAccountContent";
import SettingsContent from "./SettingsContent";
import UserManagementContent from "./UserManagementContent";
import DepartmentManagementContent from "./DepartmentManagementContent";
import TeacherManagement from "./TeacherManagement";
import CourseSchedulerContent from "./CourseSchedulerContent";
import TimeTableContent from "./TimetableContent";

interface ContentRendererProps {
  selectedContent: string;
  id: string;
  departmentId?: string;
  students: [] | undefined;
  loading: boolean;
  error: string | null;
  image: string;
  name: string;
  email: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setImage: React.Dispatch<React.SetStateAction<string>>;
  setId: React.Dispatch<React.SetStateAction<string>>;
  setDepartmentId: React.Dispatch<React.SetStateAction<string>>;
  userType: string | undefined;
}

export default function ContentRenderer({
  selectedContent,
  id,
  departmentId,
  students,
  loading,
  error,
  image,
  name,
  setName,
  setEmail,
  setImage,
  setId,
  setDepartmentId,
  userType,
}: ContentRendererProps) {
  const renderContent = () => {
    switch (selectedContent) {
      case "Home":
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
              <MainGrid students={students} loading={loading} error={error} />
            </Stack>
          </Box>
        );
      case "Courses":
        return (
          <CoursesContent
            selectedContent={selectedContent}
            departmentId={departmentId}
            userType={userType}
          />
        );
      case "Join Course":
        return (
          <EnrollCourse
            selectedContent={selectedContent}
            departmentId={departmentId}
            studentId={id}
          />
        );
      case "Course Scheduler":
        return (
          <CourseSchedulerContent
            selectedContent={selectedContent}
            type={userType}
            studentId={id}
          />
        );
      case "Timetable":
        return (
          <TimeTableContent
            selectedContent={selectedContent}
            type={userType}
            studentId={id}
          ></TimeTableContent>
        );
      case "Admin Settings":
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
            </Stack>
          </Box>
        );
      case "User Management":
        return <UserManagementContent selectedContent={selectedContent} />;
      case "Department Management":
        return (
          <DepartmentManagementContent selectedContent={selectedContent} />
        );
      case "Teacher Management":
        return <TeacherManagement selectedContent={selectedContent} />;
      case "My Account":
        return (
          <MyAccountContent
            selectedContent={selectedContent}
            id={id}
            image={image}
            type={userType}
          />
        );
      case "Settings":
        return (
          <SettingsContent
            selectedContent={selectedContent}
            id={id}
            image={image}
            name={name}
            setName={setName}
            setEmail={setEmail}
            setImage={setImage}
            setId={setId}
            setDepartmentId={setDepartmentId}
            type={userType}
          />
        );
      default:
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
              <MainGrid students={students} loading={loading} error={error} />
            </Stack>
          </Box>
        );
    }
  };

  return <>{renderContent()}</>;
}
