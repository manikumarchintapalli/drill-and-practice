// src/pages/ProblemPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Toolbar,
  Typography,
  LinearProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  useGetAllQuestionsService,
  useUpdateDashboardStatsService,
  Question,
} from '../api/apiServices';

type TopicField = 
  | string 
  | { _id: string; name: string; slug: string };

interface Problem {
  _id: string;
  topic?: TopicField;
  title: string;
  description: string;
  options: string[];
  answerIndex: number;
}

// Helpers to extract slug/name safely
const getTopicSlug = (t?: TopicField): string => {
  if (!t) return '';
  if (typeof t === 'string') {
    return t
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '');
  }
  return t.slug.toLowerCase();
};

const getTopicName = (t?: TopicField): string => {
  if (!t) return '';
  return typeof t === 'string' ? t : t.name;
};

const ProblemPage: React.FC = () => {
  const { topicSlug, index: problemId } = useParams<{
    topicSlug: string;
    index: string;
  }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: rawQuestions = [], isLoading } = useGetAllQuestionsService();
  const { mutate: updateDashboardStats, status } =
    useUpdateDashboardStatsService();
  const isSubmitting = status === 'pending';

  // Map API Questions → our Problem shape
  const allProblems: Problem[] = useMemo(
    () =>
      rawQuestions.map((q: Question) => ({
        _id: q._id,
        topic: q.topic,
        title: q.title,
        description: q.description,
        options: q.options,
        answerIndex: q.answerIndex,
      })),
    [rawQuestions]
  );

  // Filter by slug, find current index & problem
  const filtered = useMemo(
    () => allProblems.filter((p) => getTopicSlug(p.topic) === topicSlug),
    [allProblems, topicSlug]
  );
  const currentIndex = filtered.findIndex((p) => p._id === problemId);
  const problem = allProblems.find((p) => p._id === problemId);

  // Reset choice when problem changes
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  useEffect(() => {
    setSelectedOption(null);
  }, [problemId]);

  // Loading & missing states
  if (isLoading) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2} color="text.secondary">
          Loading question...
        </Typography>
      </Container>
    );
  }
  if (!problem) {
    return (
      <Container sx={{ py: 10 }}>
        <Alert severity="error">Problem not found.</Alert>
      </Container>
    );
  }

  // Handlers
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(parseInt(e.target.value, 10));
  };
  const handleSubmit = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === problem.answerIndex;
    updateDashboardStats(
      { topic: getTopicName(problem.topic), isCorrect },
      {
        onSuccess: () =>
          navigate(`/solution/${topicSlug}/${problemId}`, {
            state: { selectedOption, problem },
          }),
      }
    );
  };
  const goTo = (offset: number) => {
    const next = filtered[currentIndex + offset];
    if (next) {
      navigate(`/practice/${topicSlug}/${next._id}`);
    }
  };

  // Render
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        pt: { xs: '72px', sm: '96px' },
        pb: theme.spacing(6),
      }}
    >
      <Toolbar />

      <Container maxWidth="md">
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Topic: {getTopicName(problem.topic) || 'Unknown'}
        </Typography>

        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          fontWeight="bold"
          gutterBottom
        >
          {problem.title}
        </Typography>

        <Typography variant="body1" mb={4}>
          {problem.description}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={((currentIndex + 1) / filtered.length) * 100}
          sx={{ mb: 4, height: 10, borderRadius: 5 }}
        />

        <RadioGroup
          value={selectedOption === null ? '' : selectedOption}
          onChange={handleOptionChange}
        >
          {problem.options.map((opt, idx) => (
            <FormControlLabel
              key={idx}
              value={idx}
              control={<Radio />}
              label={opt}
              sx={{ display: 'block', mb: 1 }}
            />
          ))}
        </RadioGroup>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={() => goTo(-1)}
            disabled={currentIndex <= 0}
          >
            Previous
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            disabled={selectedOption === null || isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : (
              'Submit'
            )}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ProblemPage;
