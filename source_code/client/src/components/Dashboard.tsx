// src/pages/Dashboard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {
  useDashboardStatsService,
  useGetAllTopicsService,
  useGetAllQuestionsService,
  useResetDashboardStatsService,
} from '../api/apiServices';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ————————————————————————————————————————————————
// Local types to cover both old & new backend shape
// ————————————————————————————————————————————————
type TopicField =
  | string
  | { _id: string; name: string; slug: string };

interface Question {
  _id: string;
  topic?: TopicField;
}

interface Topic {
  _id: string;
  name: string;
  slug: string;
}

interface TopicStats {
  attempted: number;
  correct: number;
  solved?: string[];
}

type DashboardStats = Record<string, TopicStats>;

// ————————————————————————————————————————————————
// Helpers
// ————————————————————————————————————————————————
// Normalize a plain string to lower-case key
const normalize = (s: string): string => s.trim().toLowerCase();

// Safely pull out the human name from our union
const getTopicName = (t?: TopicField): string =>
  typeof t === 'string' ? t : t?.name ?? '';

// Safely pull out the slug from our union
const getTopicSlug = (t?: TopicField): string =>
  typeof t === 'string'
    ? normalize(t).replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    : t?.slug ?? '';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const COLORS = [
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  // 1️⃣ Stats, topics & problems from your hooks
  const {
    data: stats = {} as DashboardStats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useDashboardStatsService();
  const {
    data: allTopics = [] as Topic[],
    isLoading: topicsLoading,
  } = useGetAllTopicsService();
  const {
    data: allProblems = [] as Question[],
    isLoading: problemsLoading,
  } = useGetAllQuestionsService();
  const { mutate: resetDashboardStats } = useResetDashboardStatsService();

  // ⏳ Loading spinner
  if (statsLoading || topicsLoading || problemsLoading) {
    return (
      <Container
        maxWidth="sm"
        sx={{ textAlign: 'center', mt: { xs: 8, sm: 10 } }}
      >
        <CircularProgress color="primary" />
        <Typography mt={2} color="text.secondary">
          Loading your progress…
        </Typography>
      </Container>
    );
  }

  // 2️⃣ Build a map: normalized topic‐name → { name, slug }
  const topicsByKey = allTopics.reduce<
    Record<string, { name: string; slug: string }>
  >((acc, t) => {
    acc[normalize(t.name)] = { name: t.name, slug: t.slug };
    return acc;
  }, {});

  // 3️⃣ Only show stats for topics that actually exist
  const topicKeys = Object.keys(stats).filter((topicName) =>
    Boolean(topicsByKey[normalize(topicName)])
  );

  // Chart‐data helper
  const getTopicChartData = (topicName: string) => {
    const { correct = 0, attempted = 0 } = stats[topicName] || {};
    return [
      { name: 'Correct', value: correct },
      { name: 'Incorrect', value: attempted - correct },
    ];
  };

  // 4️⃣ “Start new session” resets & navigates
  const handleStartPractice = () => {
    resetDashboardStats(undefined, {
      onSuccess: async () => {
        await refetchStats();
        navigate('/practice');
      },
      onError: () => {
        navigate('/practice');
      },
    });
  };

  // ————————————————————————————————————————————————
  // Render
  // ————————————————————————————————————————————————
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        pt: { xs: '56px', sm: '64px' },
        pb: { xs: 4, sm: 6 },
        scrollBehavior: 'smooth',
      }}
    >
      <Toolbar />

      <Container>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          fontWeight="bold"
          textAlign="center"
          mb={3}
        >
          Progress Dashboard
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          color="text.secondary"
          mb={5}
        >
          Track your growth by topic and improve where needed.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              md: '1fr 1fr 1fr',
            },
            gap: 4,
            mb: 6,
          }}
        >
          {topicKeys.map((topicName) => {
            const key = normalize(topicName);
            const { name, slug } = topicsByKey[key];
            const data = getTopicChartData(topicName);

            // 👉 find all problems for this topic
            const problems = allProblems.filter(
              (q) => normalize(getTopicName(q.topic)) === key
            );
            // 👉 pick the first one not in stats.solved
            const firstUnsolved = problems.find(
              (q) => !stats[topicName]?.solved?.includes(q._id)
            );

            return (
              <Paper
                key={topicName}
                elevation={3}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: 2,
                  transition: 'box-shadow 0.3s',
                  '&:hover': { boxShadow: theme.shadows[6] },
                }}
              >
                <Typography fontWeight="bold" gutterBottom>
                  {name}
                </Typography>

                <Box height={200}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        {data.map((_, i) => (
                          <Cell
                            key={i}
                            fill={COLORS[i % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>

                <Typography
                  fontSize={14}
                  color="text.secondary"
                  mt={2}
                >
                  Questions Attempted: {stats[topicName].attempted}
                </Typography>
                <Typography fontSize={14} color="text.secondary">
                  Correct: {stats[topicName].correct}
                </Typography>

                {firstUnsolved && (
                  <Button
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 2,
                      borderRadius: 2,
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.02)' },
                    }}
                    onClick={() =>
                      navigate(
                        `/practice/${slug}/${firstUnsolved._id}`
                      )
                    }
                  >
                    Resume Practice
                  </Button>
                )}
              </Paper>
            );
          })}
        </Box>

        <Box textAlign="center">
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayCircleOutlineIcon />}
            sx={{
              px: 5,
              py: 1.5,
              borderRadius: '40px',
              fontSize: '1rem',
              transition: 'background-color 0.3s, transform 0.2s',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
                transform: 'scale(1.02)',
              },
            }}
            onClick={handleStartPractice}
          >
            Start New Practice Session
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;