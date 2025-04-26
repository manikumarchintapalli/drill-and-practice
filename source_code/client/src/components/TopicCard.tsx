import React from "react";
import { Terminal } from "@mui/icons-material";
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  HIGHLIGHTS_COLOR,
  BACKGROUND_COLOR,
} from "../lib/theme";

interface TopicCardProps {
  topic: string;
  questionCount: number;
  firstQuestionId?: string;
}

const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  questionCount,
  firstQuestionId,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const slug = topic.toLowerCase().replace(/\s+/g, "-");

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        minHeight: { xs: 240, sm: 260, md: 280 },
        p: 3,
        borderRadius: theme.shape.borderRadius * 2,
        backgroundColor: BACKGROUND_COLOR,
        transition: "0.3s",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        border: `2px solid ${SECONDARY_COLOR}`,
        "&:hover": {
          boxShadow: theme.shadows[6],
          transform: "translateY(-4px)",
        },
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Terminal fontSize="small" sx={{ color: SECONDARY_COLOR }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: SECONDARY_COLOR,
              fontSize: isMobile ? "1rem" : "1.1rem",
            }}
          >
            {topic}
          </Typography>
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
            mb: 2,
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
          }}
        >
          Practice <strong>{topic}</strong> with curated questions.
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            backgroundColor: HIGHLIGHTS_COLOR,
            color: SECONDARY_COLOR,
            fontSize: "0.75rem",
            fontWeight: 600,
            px: 2,
            py: 0.5,
            borderRadius: "999px",
            mb: 2,
          }}
        >
          {questionCount} Questions
        </Box>
      </Box>
      <Button
        fullWidth
        variant="contained"
        onClick={() =>
          navigate(`/practice/${slug}/${firstQuestionId}`)
        }
        disabled={!firstQuestionId}
        sx={{
          mt: 2,
          backgroundColor: SECONDARY_COLOR,
          color: HIGHLIGHTS_COLOR,
          fontWeight: 600,
          textTransform: "none",
          "&:hover": {
            // hover color change omitted as per instructions
          },
          "&:disabled": {
            backgroundColor: theme.palette.action.disabledBackground,
            color: theme.palette.text.disabled,
          },
        }}
      >
        Start Practice
      </Button>
    </Paper>
  );
};

export default TopicCard;