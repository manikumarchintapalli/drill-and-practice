import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Paper,
  useTheme,
} from "@mui/material";
import { useGetAllQuestionsService } from "../api/apiServices";
import TopicCard from "./TopicCard";
import {
  BACKGROUND_COLOR,
  PRIMARY_COLOR,
  SECONDARY_COLOR
} from "../lib/theme";

const groupQuestionsByTopic = (
  questions: Array<{ topic?: string; [k: string]: any }>
) => {
  const grouped: Record<string, typeof questions> = {};
  for (const q of questions) {
    const topicName = q.topic;
    if (!topicName) continue;
    if (!grouped[topicName]) grouped[topicName] = [];
    grouped[topicName].push(q);
  }
  return grouped;
};

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: questions = [], isLoading } = useGetAllQuestionsService();
  const grouped = groupQuestionsByTopic(questions);

  return (
    <Box
      sx={{
        bgcolor: BACKGROUND_COLOR,
        minHeight: "100vh",
        pt: { xs: 10, sm: 12 },
        pb: 10,
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Stack alignItems="center" spacing={3} mb={8}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            sx={{
              fontSize: { xs: "2rem", sm: "2.4rem", md: "2.8rem" },
              color: PRIMARY_COLOR,
            }}
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
            maxWidth="sm"
            textAlign="center"
            fontSize={{ xs: "1rem", sm: "1.1rem" }}
          >
            Master DBMS concepts by solving curated challenges.
            <br />
            Real‐time learning through action.
          </Typography>
        </Stack>

        {/* Explore Topics */}
        <Box mb={10}>
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
            sx={{
              color: PRIMARY_COLOR,
              fontSize: { xs: "1.3rem", sm: "1.5rem" },
            }}
          >
            Explore Topics
          </Typography>

          {isLoading ? (
            <Stack alignItems="center" py={6} spacing={2}>
              <CircularProgress sx={{ color: PRIMARY_COLOR }} />
              <Typography sx={{ color: PRIMARY_COLOR }}>
                Loading questions…
              </Typography>
            </Stack>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: 4,
              }}
            >
              {Object.entries(grouped).map(([topic, topicQuestions]) => (
                <Box key={topic} sx={{ display: "flex", justifyContent: "center" }}>
                  <Box sx={{ width: "100%", maxWidth: 320 }}>
                    <TopicCard
                      topic={topic}
                      questionCount={topicQuestions.length}
                      firstQuestionId={topicQuestions[0]?._id}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Quick Drill */}
        <Box mt={12} mb={8}>
          <Typography
            variant="h5"
            fontWeight="bold"
            mb={3}
            sx={{
              color: PRIMARY_COLOR,
              fontSize: { xs: "1.3rem", sm: "1.5rem" },
            }}
          >
            Quick Drill
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 4,
            }}
          >
            {Object.entries(grouped)
              .slice(0, 5)
              .map(([topic]) => {
                const slug = topic.toLowerCase().replace(/\s+/g, "-");
                return (
                  <Paper
                    key={slug}
                    elevation={3}
                    onClick={() => navigate(`/learn/${slug}`)}
                    sx={{
                      p: 3,
                      textAlign: "center",
                      cursor: "pointer",
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      bgcolor: theme.palette.background.paper,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{ color: SECONDARY_COLOR, mb: 1 }}
                      fontSize={{ xs: "1rem", sm: "1.1rem" }}
                    >
                      {topic}
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