// src/pages/ProblemPage.tsx
import React, { useEffect, useState } from 'react';
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

interface Problem {
  _id: string;
  topic?: string;
  title: string;
  description: string;
  options: string[];
  answerIndex: number;
}

const ProblemPage: React.FC = () => {
  const { topicSlug, index: problemId } = useParams<{
    topicSlug: string;
    index: string;
  }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 1) Fetch raw questions
  const { data: rawQuestions = [], isLoading } = useGetAllQuestionsService();
  // 2) Mutation for stats
  const { mutate: updateDashboardStats, status } =
    useUpdateDashboardStatsService();
  const isSubmitting = status === 'pending';

  // 3) Map into our Problem type
  const allProblems: Problem[] = rawQuestions.map((q: Question) => ({
    _id: q._id,
    topic: q.topic,
    title: (q as any).title,
    description: (q as any).description,
    options: (q as any).options,
    answerIndex: (q as any).answerIndex,
  }));

  // 4) State for the user’s choice
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // 5) Locate the current problem
  const problem = allProblems.find((p) => p._id === problemId);

  // 6) Filter by topic slug
  const filtered = allProblems.filter((p) =>
    (p.topic ?? '')
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '') === topicSlug
  );
  const currentIndex = filtered.findIndex((p) => p._id === problemId);

  // 7) Reset selection on problem change
  useEffect(() => {
    setSelectedOption(null);
  }, [problemId]);

  // 8) Loading & not found states
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

  // 9) Handlers
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(parseInt(e.target.value, 10));
  };
  const handleSubmit = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === problem.answerIndex;
    updateDashboardStats(
      { topic: problem.topic ?? '', isCorrect },
      {
        onSuccess: () => {
          navigate(`/solution/${topicSlug}/${problemId}`, {
            state: { selectedOption, problem },
          });
        },
      }
    );
  };
  const goTo = (offset: number) => {
    const next = filtered[currentIndex + offset];
    if (next) navigate(`/practice/${topicSlug}/${next._id}`);
  };

  // 10) Render
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        // reserve space for your fixed navbar
        pt: { xs: '72px', sm: '96px' },
        pb: theme.spacing(6),
      }}
    >
      {/* optional: keep Toolbar if you use MUI AppBar */}
      <Toolbar />

      <Container maxWidth="md">
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Topic: {problem.topic ?? 'Unknown'}
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
          {problem.options.map((opt: string, idx: number) => (
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
            disabled={currentIndex === 0}
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