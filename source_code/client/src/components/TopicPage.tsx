
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useGetAllQuestionsService, Question as APIQuestion } from "../api/apiServices";

// ✅ Extend the APIQuestion interface to ensure title exists
type QuestionWithTitle = APIQuestion & { title: string };

// ✅ Type guard to ensure `topic` and `title` are present
function isValidQuestion(q: APIQuestion): q is QuestionWithTitle & { topic: string } {
  return typeof q.title === "string" && typeof q.topic === "string";
}

const TopicPage: React.FC = () => {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { data = [], isLoading } = useGetAllQuestionsService();

  if (isLoading) {
    return (
      <Container sx={{ py: theme.spacing(8), textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  // ✅ Filter and normalize topic slug
  const normalize = (str: string) =>
    str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  const validQuestions = data.filter(isValidQuestion);
  const filtered = validQuestions.filter(
    (q) => normalize(q.topic) === topicSlug
  );

  const topicName = filtered[0]?.topic;

  if (!topicName) {
    return (
      <Container sx={{ py: theme.spacing(8), textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Topic not found
        </Typography>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        py: theme.spacing(6),
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={3}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <MenuBookIcon color="secondary" />
              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="bold"
                color="secondary.main"
              >
                {topicName}
              </Typography>
            </Box>

            <Typography variant="body2" color="text.secondary" mb={3}>
              This topic contains {filtered.length} practice question
              {filtered.length !== 1 ? "s" : ""}.
            </Typography>

            <Typography variant="h6" fontWeight="bold" mb={1}>
              Key Concepts to Learn
            </Typography>
            <List disablePadding dense>
              {[
                "Read questions carefully",
                "Review explanations",
                "Track correctness",
              ].map((text, i) => (
                <ListItem key={i} disableGutters>
                  <ListItemIcon sx={{ minWidth: 30 }}>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>

            <Box
              mt={4}
              display="flex"
              flexDirection={isMobile ? "column" : "row"}
              gap={2}
              justifyContent="space-between"
              alignItems={isMobile ? "stretch" : "center"}
            >
              <Chip
                label={`${filtered.length} Questions`}
                color="primary"
                sx={{ fontWeight: 500 }}
              />
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={() =>
                  navigate(`/practice/${topicSlug}/${filtered[0]._id}`)
                }
                sx={{
                  backgroundColor: "secondary.main",
                  color: "warning.main",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
              >
                Start Practice
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default TopicPage;