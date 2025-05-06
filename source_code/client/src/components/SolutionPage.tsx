

import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  Paper,
  TextField,
  Typography,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import { useGetAllQuestionsService } from "../api/apiServices";

interface Problem {
  _id: string;
  topic?: string | { name?: string };  // <-- now optional
  title: string;
  description?: string;
  options: string[];
  answerIndex: number;
}

interface LocationState {
  selectedOption: number;
  problem: Problem;
}

const SolutionPage: React.FC = () => {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const location = useLocation();
  const state = (location.state as LocationState) || undefined;
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [assumption, setAssumption] = useState("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: allProblems = [] } = useGetAllQuestionsService();

  if (!state) {
    return (
      <Container sx={{ py: theme.spacing(8), textAlign: "center" }}>
        <Alert severity="error">No solution data found!</Alert>
      </Container>
    );
  }

  const { selectedOption, problem } = state;
  const isCorrect = selectedOption === problem.answerIndex;

  // Safely extract a topic name (handles string, object, or undefined)
  const getTopicName = (t?: string | { name?: string }): string =>
    typeof t === "string" ? t : t?.name ?? "";

  const normalize = (s: string) =>
    s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  // Filter problems in the same topic by slug
  const topicProblems = allProblems.filter(
    (p) => normalize(getTopicName(p.topic)) === topicSlug
  );
  const currentIndex = topicProblems.findIndex((p) => p._id === problem._id);
  const nextProblem = topicProblems[currentIndex + 1];

  // PROD vs DEV base URL for your AWS endpoint
  const apiBase = import.meta.env.PROD
    ? "http://ec2-3-149-242-97.us-east-2.compute.amazonaws.com:8080"
    : "";

  const handleAnalyze = async () => {
    if (!assumption.trim()) {
      alert("Please enter your assumption!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: problem.title,
          userAnswer: problem.options[selectedOption],
          correctAnswer: problem.options[problem.answerIndex],
          assumption,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { feedback } = await res.json();
      setAnalysis(feedback);
    } catch (err) {
      console.error("Analyze API error:", err);
      alert("Failed to analyze. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1f2428 0%, #3a3f44 50%, #ececec 100%)",
      }}
    >
      <Toolbar />

      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Card
          elevation={4}
          sx={{
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: theme.shape.borderRadius * 2,
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              align="center"
              fontWeight="bold"
              mb={3}
              color="primary.main"
            >
              Solution Overview
            </Typography>

            <Box mb={3}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Question
              </Typography>
              <Typography variant="body1" mb={1}>
                {problem.title}
              </Typography>
              {problem.description && (
                <Typography variant="body2" color="text.secondary">
                  {problem.description}
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Alert severity={isCorrect ? "success" : "error"} sx={{ mb: 2 }}>
              {isCorrect
                ? "Correct! You chose the right answer."
                : "Oops! Your answer was incorrect."}
            </Alert>

            <Typography variant="body1" gutterBottom>
              <strong>Your Answer:</strong> {problem.options[selectedOption]}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Correct Answer:</strong> {problem.options[problem.answerIndex]}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" mb={1}>
              Your Assumption
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Explain why you chose that answer..."
              value={assumption}
              onChange={(e) => setAssumption(e.target.value)}
              disabled={loading || !!analysis}
            />

            {!analysis && (
              <Box mt={3} textAlign="center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? "AI Generating…" : "Get AI Feedback"}
                </Button>
                {loading && (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <FlashOnIcon
                      color="warning"
                      sx={{
                        fontSize: 64,
                        animation: "spark 1.2s ease-in-out infinite",
                      }}
                    />
                  </Box>
                )}
              </Box>
            )}

            {analysis && (
              <Paper
                elevation={3}
                sx={{
                  mt: 4,
                  p: 3,
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  backgroundColor: "background.paper",
                  animation: "slideIn 0.4s ease-in-out",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  color="primary.main"
                >
                  AI Feedback
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List disablePadding>
                  {analysis
                    .split("\n")
                    .filter(
                      (l) =>
                        !!l.trim() &&
                        !l.toLowerCase().startsWith("correct answer")
                    )
                    .map((line, i) => (
                      <ListItem key={i} disableGutters>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <InfoOutlinedIcon color="primary" />
                        </ListItemIcon>
                        <Typography variant="body2">{line.trim()}</Typography>
                      </ListItem>
                    ))}
                </List>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" fontWeight="bold">
                  Correct Answer: {problem.options[problem.answerIndex]}
                </Typography>
              </Paper>
            )}

            <Box mt={4}>
              {nextProblem ? (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() =>
                    navigate(`/practice/${topicSlug}/${nextProblem._id}`)
                  }
                >
                  Next Question
                </Button>
              ) : (
                <Alert severity="info">
                  You've completed all questions in this topic!
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spark {
          0% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.2; transform: scale(0.8); }
        }
      `}</style>
    </Box>
  );
};

export default SolutionPage;