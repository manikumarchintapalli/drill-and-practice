// src/pages/Home.tsx

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Paper,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  useGetAllQuestionsService,
  useGetAllTopicsService,
} from "../api/apiServices";
import TopicCard from "./TopicCard";
import {
  BACKGROUND_COLOR,
  PRIMARY_COLOR,
  SECONDARY_COLOR,
} from "../lib/theme";

const groupQuestionsByTopic = (
  questions: Array<{ topic?: string; [k: string]: any }>
) => {
  const grouped: Record<string, typeof questions> = {};
  for (const q of questions) {
    const topicId = q.topic;
    if (!topicId) continue;
    if (!grouped[topicId]) grouped[topicId] = [];
    grouped[topicId].push(q);
  }
  return grouped;
};

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // 1) fetch questions
  const {
    data: questions = [],
    isLoading: questionsLoading,
  } = useGetAllQuestionsService();

  // 2) fetch topics
  const {
    data: topics = [],
    isLoading: topicsLoading,
  } = useGetAllTopicsService();

  // 3) build id → name map
  const topicMap = useMemo(() => {
    const m: Record<string, string> = {};
    topics.forEach((t: any) => {
      // your API returns { _id, name } (or maybe { id, name })
      const id = t._id ?? t.id;
      if (id) {
        m[id] = t.name;
      }
    });
    return m;
  }, [topics]);

  // 4) group by topic _id
  const grouped = useMemo(
    () => groupQuestionsByTopic(questions),
    [questions]
  );

  // show spinner until both have loaded
  const loading = questionsLoading || topicsLoading;

  return (
    <Box
      sx={{
        bgcolor: BACKGROUND_COLOR,
        minHeight: "100vh",
        pt: isMobile ? "56px" : "64px",
        pb: 10,
        scrollBehavior: "smooth",
      }}
    >
      <Toolbar />

      <Container maxWidth="lg">
        {/* Hero */}
        <Stack alignItems="center" spacing={3} mb={8}>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight="bold"
            textAlign="center"
            sx={{ color: PRIMARY_COLOR }}
          >
            Welcome to{" "}
            <Box
              component="span"
              sx={{
                textDecoration: "underline",
                textUnderlineOffset: 6,
                color: PRIMARY_COLOR,
              }}
            >
              Drill &amp; Practice
            </Box>
          </Typography>
          <Typography
            variant="body1"
            color="text.primary"
            maxWidth={isMobile ? "100%" : "600px"}
            textAlign="center"
          >
            Master DBMS concepts by solving curated challenges.
            <br />
            Real-time learning through action.
          </Typography>
        </Stack>

        {/* Explore Topics */}
        <Box mb={10}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight="bold"
            mb={3}
            sx={{ color: PRIMARY_COLOR }}
          >
            Explore Topics
          </Typography>

          {loading ? (
            <Stack alignItems="center" py={6} spacing={2}>
              <CircularProgress sx={{ color: PRIMARY_COLOR }} />
              <Typography sx={{ color: PRIMARY_COLOR }}>
                Loading…
              </Typography>
            </Stack>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 4,
              }}
            >
              {Object.entries(grouped).map(
                ([topicId, topicQuestions]) => {
                  const topicName = topicMap[topicId] ?? topicId;
                  return (
                    <Box
                      key={topicId}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <Box sx={{ width: "100%", maxWidth: 320 }}>
                        <TopicCard
                          topic={topicName}
                          questionCount={topicQuestions.length}
                          firstQuestionId={topicQuestions[0]?._id}
                        />
                      </Box>
                    </Box>
                  );
                }
              )}
            </Box>
          )}
        </Box>

        {/* Quick Drill */}
        <Box mt={12} mb={8}>
          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight="bold"
            mb={3}
            sx={{ color: PRIMARY_COLOR }}
          >
            Quick Drill
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 4,
            }}
          >
            {Object.entries(grouped)
              .slice(0, 5)
              .map(([topicId, topicQuestions]) => {
                const topicName = topicMap[topicId] ?? topicId;
                const slug = topicName
                  .toLowerCase()
                  .replace(/\s+/g, "-");
                return (
                  <Paper
                    key={topicId}
                    elevation={3}
                    onClick={() => navigate(`/learn/${slug}`)}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      bgcolor: theme.palette.background.paper,
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      fontWeight="bold"
                      sx={{ color: SECONDARY_COLOR, mb: 1 }}
                    >
                      {topicName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View key concepts for this topic
                    </Typography>
                  </Paper>
                );
              })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;