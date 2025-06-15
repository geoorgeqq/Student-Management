import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Copyright from "../internals/components/Copyright";
import ChartUserByCountry from "./ChartUserByCountry";
import CustomizedDataGrid from "./CustomizedDataGrid";
import HighlightedCard from "./HighlightedCard";
import PageViewsBarChart from "./PageViewsBarChart";
import SessionsChart from "./SessionsChart";
import StatCard, { StatCardProps } from "./StatCard";
import axios from "axios";

interface MainGridProps {
  students: [] | undefined;
  loading: boolean;
  error: string | null;
}

export default function MainGrid({ students, loading, error }: MainGridProps) {
  // Calculate the number of students
  const userCount = students ? students.length : 0;
  const [courseCount, setCourseCount] = React.useState<number>(0);
  const [teacherCount, setTeacherCount] = React.useState<number>(0);
  const jwtToken = localStorage.getItem("jsonWebToken");

  React.useEffect(() => {
    const fetchCounts = async () => {
      try {
        const coursesResponse = await axios.get(
          `http://localhost:8080/courses`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setCourseCount(coursesResponse.data.length);

        const teachersResponse = await axios.get(
          `http://localhost:8080/teacher`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        setTeacherCount(teachersResponse.data.length);
      } catch (err) {
        console.error("Failed to fetch counts", err);
      }
    };

    fetchCounts();
  }, []);

  // Define the data for the cards
  const data: StatCardProps[] = [
    {
      title: "Students",
      value: `${userCount.toLocaleString()}`, // Convert to string with commas
      interval: "Last 30 days",
      trend: userCount > 0 ? "up" : "neutral", // Adjust trend based on user count
      data: [],
    },
    {
      title: "Courses",
      value: `${courseCount.toLocaleString()}`,
      interval: "Last 30 days",
      trend: courseCount > 0 ? "up" : "neutral",
      data: [],
    },
    {
      title: "Teachers",
      value: `${teacherCount.toLocaleString()}`,
      interval: "Last 30 days",
      trend: teacherCount > 0 ? "up" : "neutral",
      data: [],
    },
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      {/* cards */}
      <Typography
        component="h2"
        variant="h6"
        sx={{ mb: 2, fontFamily: "Roboto" }}
      >
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2), fontFamily: "Roboto" }}
      >
        {data.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
