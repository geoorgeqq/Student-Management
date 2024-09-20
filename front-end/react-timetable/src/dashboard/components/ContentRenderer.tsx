import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { alpha } from "@mui/material/styles";
import Header from "./Header";
import MainGrid from "./MainGrid";
import CoursesContent from "./CoursesContent";
import EnrollCourse from "./EnrollCourse";

interface ContentRendererProps {
  selectedContent: string;
  id: string;
  departmentId: string;
  students: [] | undefined;
  loading: boolean;
  error: string | null;
}

export default function ContentRenderer({
  selectedContent,
  id,
  departmentId,
  students,
  loading,
  error,
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
      case "Timetable":
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
