// src/pages/Practice.tsx

import React from 'react';
import {
  Box,
  Container,
  Stack,
  Typography,
  SvgIcon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import PracticeTable from './PracticeTable';
import { useGetAllQuestionsService } from '../api/apiServices';
import type { Problem as PracticeTableProblem } from './PracticeTable';

const Practice: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: problems = [], isLoading } = useGetAllQuestionsService();

  const enhancedProblems: PracticeTableProblem[] = problems.map((p) => ({
    id: p._id,
    status: 'todo',
    title: p.title ?? 'Untitled',
    difficulty: (p as any).difficulty ?? 'Easy',
    topic: p.topic ?? '',
    ...p,
  }));

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        
        pt: { xs: '80px', sm: '110px' },
        pb: theme.spacing(6),
        scrollBehavior: 'smooth',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          mb={4}
          flexWrap="wrap"
        >
          <SvgIcon color="warning" fontSize={isMobile ? 'medium' : 'large'}>
            <LightbulbIcon />
          </SvgIcon>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            fontWeight="bold"
            sx={{ color: 'secondary.main' }}
          >
            Practice Workspace
          </Typography>
        </Stack>

        <PracticeTable problems={enhancedProblems} isLoading={isLoading} />
      </Container>
    </Box>
  );
};

export default Practice;