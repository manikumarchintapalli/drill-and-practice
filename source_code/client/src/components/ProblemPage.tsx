// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//   Box,
//   Container,
//   Typography,
//   LinearProgress,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Button,
//   Grid,
//   Alert,
//   CircularProgress,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";

// import {
//   useGetAllQuestionsService,
//   useUpdateDashboardStatsService,
// } from "../api/apiServices";

// const ProblemPage = () => {
//   const { topicSlug, index: problemId } = useParams();
//   const navigate = useNavigate();

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const { data: allProblems = [], isLoading } = useGetAllQuestionsService();
//   const { mutate: updateDashboardStats, isLoading: isSubmitting } =
//     useUpdateDashboardStatsService();

//   const [selectedOption, setSelectedOption] = useState(null);

//   const problem = allProblems.find((p) => p._id === problemId?.toString());

//   const filteredProblems = allProblems.filter((p) => {
//     const generatedSlug = p.topic?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
//     return generatedSlug === topicSlug;
//   });

//   const currentIndex = filteredProblems.findIndex((p) => p._id === problemId);

//   useEffect(() => {
//     setSelectedOption(null);
//   }, [problem]);

//   const handleOptionChange = (e) => {
//     setSelectedOption(parseInt(e.target.value));
//   };

//   const handleSubmit = () => {
//     if (selectedOption === null || !problem || !problem.topic) {
//       console.error("Invalid data before submitting:", {
//         selectedOption,
//         problem,
//         topic: problem?.topic,
//       });
//       return;
//     }

//     const isCorrect = selectedOption === problem.answerIndex;

//     updateDashboardStats(
//       {
//         topic: problem.topic,
//         isCorrect,
//       },
//       {
//         onSuccess: () => {
//           navigate(`/solution/${topicSlug}/${problemId}`, {
//             state: { selectedOption, problem },
//           });
//         },
//         onError: (err) => {
//           console.error("Failed to update stats", err);
//         },
//       }
//     );
//   };

//   const goTo = (offset) => {
//     const newIndex = currentIndex + offset;
//     const nextProblem = filteredProblems[newIndex];
//     if (nextProblem) {
//       navigate(`/practice/${topicSlug}/${nextProblem._id}`);
//     }
//   };

//   if (isLoading) {
//     return (
//       <Container sx={{ py: 10, textAlign: "center" }}>
//         <CircularProgress />
//         <Typography mt={2} color="text.secondary">
//           Loading question...
//         </Typography>
//       </Container>
//     );
//   }

//   if (!problem) {
//     return (
//       <Container sx={{ py: 10 }}>
//         <Alert severity="error">Problem not found.</Alert>
//       </Container>
//     );
//   }

//   return (
//     <Box sx={{ bgcolor: "#f9fafb", minHeight: "100vh", pt: { xs: 8, md: 10 }, pb: 6 }}>
//       <Container maxWidth="md">
//         {/* Topic and Title */}
//         <Typography variant="subtitle2" color="text.secondary" gutterBottom>
//           Topic: {problem.topic}
//         </Typography>
//         <Typography
//           variant={isMobile ? "h6" : "h5"}
//           fontWeight="bold"
//           gutterBottom
//         >
//           {problem.title}
//         </Typography>
//         <Typography variant="body1" mb={4}>
//           {problem.description}
//         </Typography>

//         {/* Progress Bar */}
//         <LinearProgress
//           variant="determinate"
//           value={((currentIndex + 1) / filteredProblems.length) * 100}
//           sx={{ mb: 4, height: 10, borderRadius: 5 }}
//         />

//         {/* Answer Options */}
//         <RadioGroup value={selectedOption} onChange={handleOptionChange}>
//           {problem.options.map((option, idx) => (
//             <FormControlLabel
//               key={idx}
//               value={idx}
//               control={<Radio />}
//               label={option}
//               sx={{ display: "block", mb: 1 }}
//             />
//           ))}
//         </RadioGroup>

//         {/* Buttons */}
//         <Grid container spacing="span 2" mt="span 4">
//           <Grid item xs="span 12" sm="span 6">
//             <Button
//               fullWidth
//               variant="outlined"
//               onClick={() => goTo(-1)}
//               disabled={currentIndex === 0}
//             >
//               Previous
//             </Button>
//           </Grid>
//           <Grid item xs="span 12" sm="span 6">
//             <Button
//               fullWidth
//               variant="contained"
//               onClick={handleSubmit}
//               disabled={selectedOption === null || isSubmitting}
//             >
//               {isSubmitting && <CircularProgress size={20} sx={{ mr: 1 }} />}
//               Submit
//             </Button>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };


// export default ProblemPage;



// src/components/ProblemPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
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
  const { topicSlug, index: problemId } = useParams<{ topicSlug: string; index: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: allProblems = [], isLoading } = useGetAllQuestionsService();
  const { mutate: updateDashboardStats, isPending: isSubmitting } = useUpdateDashboardStatsService();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const problem = allProblems.find(p => p._id === problemId);

  const filtered = allProblems.filter(p =>
    (p.topic ?? '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') === topicSlug
  );

  const currentIndex = filtered.findIndex(p => p._id === problemId);

  useEffect(() => {
    setSelectedOption(null);
  }, [problem]);

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

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        minHeight: '100vh',
        pt: { xs: theme.spacing(8), md: theme.spacing(10) },
        pb: theme.spacing(6),
      }}
    >
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

        <RadioGroup value={selectedOption ?? ''} onChange={handleOptionChange}>
          {problem.options.map((opt:string, idx:number) => (
            <FormControlLabel
              key={idx}
              value={idx}
              control={<Radio />}
              label={opt}
              sx={{ display: 'block', mb: 1 }}
            />
          ))}
        </RadioGroup>

        {/* FLEXBOX BUTTONS */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mt: 2,
          }}
        >
          <Box flex={1}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => goTo(-1)}
              disabled={currentIndex === 0}
            >
              Previous
            </Button>
          </Box>
          <Box flex={1}>
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
        </Box>
      </Container>
    </Box>
  );
};

export default ProblemPage;