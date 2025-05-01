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

const groupByTopic = (qs: Array<{ topic?: string }>) => {
  return qs.reduce<Record<string, typeof qs>>((acc, q) => {
    if (!q.topic) return acc;
    (acc[q.topic] = acc[q.topic] || []).push(q);
    return acc;
  }, {});
};

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data: questions = [], isLoading: qLoading } = useGetAllQuestionsService();
  const { data: topics = [], isLoading: tLoading } = useGetAllTopicsService();

  const loading = qLoading || tLoading;

  // build { topicId → topicName } map
  const topicMap = useMemo(() => {
    const m: Record<string, string> = {};
    topics.forEach((t: any) => {
      const id = t._id ?? t.id;
      if (id) m[id] = t.name;
    });
    return m;
  }, [topics]);

  // group the questions by that topicId
  const grouped = useMemo(() => groupByTopic(questions), [questions]);

  return (
    <Box sx={{ bgcolor: BACKGROUND_COLOR, minHeight: "100vh", pt: isMobile ? 56 : 64, pb: 10 }}>
      <Toolbar />
      <Container maxWidth="lg">
        {/* Hero… */}
        <Stack alignItems="center" spacing={3} mb={8}>
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold" sx={{ color: PRIMARY_COLOR }}>
            Welcome to <Box component="span" sx={{ textDecoration: "underline", textUnderlineOffset: 6 }}>Drill &amp; Practice</Box>
          </Typography>
          <Typography textAlign="center" maxWidth={isMobile ? "100%" : 600}>
            Master DBMS concepts by solving curated challenges.
          </Typography>
        </Stack>

        {/* Explore */}
        <Box mb={10}>
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" mb={3} sx={{ color: PRIMARY_COLOR }}>
            Explore Topics
          </Typography>

          {loading ? (
            <Stack alignItems="center" py={6}>
              <CircularProgress sx={{ color: PRIMARY_COLOR }} />
              <Typography sx={{ color: PRIMARY_COLOR }}>Loading…</Typography>
            </Stack>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(240px,1fr))", gap: 4 }}>
              {Object.entries(grouped).map(([topicId, qs]) => {
                const name = topicMap[topicId] ?? topicId;
                return (
                  <Box key={topicId} sx={{ display: "flex", justifyContent: "center" }}>
                    <Box sx={{ width: "100%", maxWidth: 320 }}>
                      <TopicCard
                        topic={name}
                        questionCount={qs.length}
                        firstQuestionId={qs[0]?._id}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        {/* Quick Drill… */}
      </Container>
    </Box>
  );
};

export default Home;