// import { Container, Box, Typography, Stack, SvgIcon, useTheme, useMediaQuery } from "@mui/material";
// import LightbulbIcon from "@mui/icons-material/Lightbulb";
// import PracticeTable from "./PracticeTable";
// import { useGetAllQuestionsService } from "../api/apiServices";

// const Practice = () => {
//   const { data: problems = [], isLoading } = useGetAllQuestionsService();

//   const enhancedProblems = problems.map((p) => ({
//     ...p,
//     id: p._id,
//     status: "todo",
//   }));

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   return (
//     <Box
//       sx={{
//         bgcolor: "#f8f9fa",
//         minHeight: "100vh",
//         py: { xs: 6, md: 8 },
//         pt: { xs: 10, md: 12 }, // Ensures space below navbar
//       }}
//     >
//       <Container maxWidth="lg">
//         <Stack
//           direction="row"
//           alignItems="center"
//           spacing={2}
//           mb={4}
//           flexWrap="wrap"
//         >
//           <SvgIcon color="warning" fontSize={isMobile ? "medium" : "large"}>
//             <LightbulbIcon />
//           </SvgIcon>
//           <Typography
//             variant={isMobile ? "h5" : "h4"}
//             fontWeight="bold"
//             sx={{ color: "#4B0082" }}
//           >
//             Practice Workspace
//           </Typography>
//         </Stack>

//         <PracticeTable problems={enhancedProblems} isLoading={isLoading} />
//       </Container>
//     </Box>
//   );
// };

// export default Practice;

// src/components/Practice.tsx
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
import type { Problem as PracticeTableProblem } from './PracticeTable'; // ✅ import the expected Problem type

const Practice: React.FC = () => {
  const { data: problems = [], isLoading } = useGetAllQuestionsService();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ✅ Enhanced problems guaranteed to match PracticeTable.Problem
  const enhancedProblems: PracticeTableProblem[] = problems.map(p => ({
    ...p,
    id: p._id,
    status: 'todo',
    title: p.title ?? 'Untitled',
    difficulty: p.difficulty ?? 'Easy',
    topic: p.topic ?? '', // ✅ ensure topic is always a string
  }));

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        py: { xs: theme.spacing(6), md: theme.spacing(8) },
        pt: { xs: theme.spacing(10), md: theme.spacing(12) },
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" spacing={2} mb={4} flexWrap="wrap">
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