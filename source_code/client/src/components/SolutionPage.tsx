// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import {
//   Alert,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   CircularProgress,
//   Container,
//   TextField,
//   Typography,
//   Divider,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { useState } from "react";
// import { useGetAllQuestionsService } from "../api/apiServices";

// const SolutionPage = () => {
//   const { topicSlug } = useParams();
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const [assumption, setAssumption] = useState("");
//   const [analysis, setAnalysis] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const { data: allProblems = [] } = useGetAllQuestionsService();

//   if (!state) {
//     return (
//       <Container sx={{ py: 8, textAlign: "center" }}>
//         <Alert severity="error">No solution data found!</Alert>
//       </Container>
//     );
//   }

//   const { selectedOption, problem } = state;
//   const isCorrect = selectedOption === problem.answerIndex;

//   const handleAnalyze = async () => {
//     if (!assumption.trim()) {
//       alert("Please enter your assumption!");
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:8080/api/analyze", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           question: problem.title,
//           userAnswer: problem.options[selectedOption],
//           correctAnswer: problem.options[problem.answerIndex],
//           assumption,
//         }),
//       });

//       if (!response.ok) {
//         const text = await response.text();
//         throw new Error(`Server Error: ${response.status} - ${text}`);
//       }

//       const { feedback } = await response.json();
//       if (!feedback) throw new Error("No feedback returned from API");

//       setAnalysis(feedback);
//     } catch (err) {
//       console.error("AI Analysis Error:", err);
//       alert("Failed to analyze. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const normalized = (str) =>
//     str.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

//   const filteredProblems = allProblems.filter(
//     (p) => normalized(p.topic) === topicSlug
//   );
//   const currentIndex = filteredProblems.findIndex((p) => p._id === problem._id);
//   const nextProblem = filteredProblems[currentIndex + 1];

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         py: { xs: 6, md: 8 },
//         bgcolor: "#f4f6f8",
//         display: "flex",
//         alignItems: "center",
//       }}
//     >
//       <Container maxWidth="md">
//         <Card
//           elevation={4}
//           sx={{
//             p: { xs: 3, sm: 4 },
//             borderRadius: 3,
//             boxShadow: 3,
//             backgroundColor: "#fff",
//           }}
//         >
//           <Typography
//             variant={isMobile ? "h5" : "h4"}
//             textAlign="center"
//             fontWeight="bold"
//             mb={3}
//             color="primary.main"
//           >
//             Solution Overview
//           </Typography>

//           <Box mb={3}>
//             <Typography variant="h6" fontWeight={600} gutterBottom>
//               Question
//             </Typography>
//             <Typography variant="body1" mb={1}>
//               {problem.title}
//             </Typography>
//             <Typography variant="body2" color="text.secondary">
//               {problem.description}
//             </Typography>
//           </Box>

//           <Divider sx={{ my: 3 }} />

//           <Alert severity={isCorrect ? "success" : "error"} sx={{ mb: 2 }}>
//             {isCorrect
//               ? "Correct! You chose the right answer."
//               : "Oops! Your answer was incorrect."}
//           </Alert>

//           <Typography variant="body1" gutterBottom>
//             <strong>Your Answer:</strong> {problem.options[selectedOption]}
//           </Typography>
//           <Typography variant="body1" gutterBottom>
//             <strong>Correct Answer:</strong> {problem.options[problem.answerIndex]}
//           </Typography>

//           <Divider sx={{ my: 3 }} />

//           <Typography variant="h6" mb={1}>
//             Your Assumption
//           </Typography>
//           <TextField
//             fullWidth
//             multiline
//             rows={4}
//             placeholder="Explain why you chose that answer..."
//             value={assumption}
//             onChange={(e) => setAssumption(e.target.value)}
//             disabled={loading || Boolean(analysis)}
//           />

//           {!analysis && (
//             <Box mt={3}>
//               <Button
//                 variant="contained"
//                 fullWidth
//                 onClick={handleAnalyze}
//                 disabled={loading}
//                 size="large"
//               >
//                 {loading ? (
//                   <>
//                     <CircularProgress size={20} sx={{ mr: 1 }} /> Analyzing...
//                   </>
//                 ) : (
//                   "Get AI Feedback"
//                 )}
//               </Button>
//             </Box>
//           )}

//           {analysis && (
//             <Box
//               sx={{
//                 mt: 4,
//                 p: 2,
//                 backgroundColor: "#eaf1ff",
//                 borderRadius: 2,
//                 animation: "slideIn 0.4s ease-in-out",
//               }}
//             >
//               <Typography
//                 variant="h6"
//                 fontWeight="bold"
//                 mb={1}
//                 color="primary"
//               >
//                 AI Feedback
//               </Typography>
//               <ul style={{ paddingLeft: 20, margin: 0 }}>
//                 {analysis
//                   .split("\n")
//                   .filter((line) => line.trim())
//                   .map((line, i) => (
//                     <li key={i}>
//                       <Typography variant="body2">{line.trim()}</Typography>
//                     </li>
//                   ))}
//               </ul>
//             </Box>
//           )}

//           <Box mt={4}>
//             {nextProblem ? (
//               <Button
//                 variant="outlined"
//                 fullWidth
//                 onClick={() =>
//                   navigate(`/practice/${topicSlug}/${nextProblem._id}`)
//                 }
//               >
//                 Next Question
//               </Button>
//             ) : (
//               <Alert severity="info" sx={{ mt: 2 }}>
//                 You've completed all questions in this topic!
//               </Alert>
//             )}
//           </Box>
//         </Card>
//       </Container>

//       <style>
//         {`
//           @keyframes slideIn {
//             from { transform: translateY(15px); opacity: 0; }
//             to { transform: translateY(0); opacity: 1; }
//           }
//         `}
//       </style>
//     </Box>
//   );
// };

// export default SolutionPage;

import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useGetAllQuestionsService } from "../api/apiServices";

interface Problem {
  _id: string;
  topic: string;
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
  const state = location.state as LocationState | undefined;
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

  // filter out current topic's problems
  const normalize = (s: string) =>
    s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
  const filtered = allProblems.filter(
    (p) => normalize(p.topic || "") === topicSlug
  );
  const idx = filtered.findIndex((p) => p._id === problem._id);
  const next = filtered[idx + 1];

  const handleAnalyze = async () => {
    if (!assumption.trim()) {
      alert("Please enter your assumption!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
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
      console.error(err);
      alert("Failed to analyze. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: theme.spacing(6), md: theme.spacing(8) },
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        <Card
          elevation={4}
          sx={{
            backgroundColor: "background.paper",
            borderRadius: theme.shape.borderRadius * 2,
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              textAlign="center"
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
              <Typography variant="body2" color="text.secondary">
                {problem.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Alert
              severity={isCorrect ? "success" : "error"}
              sx={{ mb: 2 }}
            >
              {isCorrect
                ? "Correct! You chose the right answer."
                : "Oops! Your answer was incorrect."}
            </Alert>

            <Typography variant="body1" gutterBottom>
              <strong>Your Answer:</strong>{" "}
              {problem.options[selectedOption]}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Correct Answer:</strong>{" "}
              {problem.options[problem.answerIndex]}
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
              disabled={loading || Boolean(analysis)}
            />

            {!analysis && (
              <Box mt={3}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleAnalyze}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress
                        size={20}
                        sx={{ mr: 1 }}
                      />
                      Analyzing...
                    </>
                  ) : (
                    "Get AI Feedback"
                  )}
                </Button>
              </Box>
            )}

            {analysis && (
              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  backgroundColor: "info.light",
                  borderRadius: theme.shape.borderRadius,
                  animation: "slideIn 0.4s ease-in-out",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  mb={1}
                  color="primary.main"
                >
                  AI Feedback
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {analysis
                    .split("\n")
                    .filter((l) => l.trim())
                    .map((l, i) => (
                      <li key={i}>
                        <Typography variant="body2">
                          {l.trim()}
                        </Typography>
                      </li>
                    ))}
                </ul>
              </Box>
            )}

            <Box mt={4}>
              {next ? (
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() =>
                    navigate(
                      `/practice/${topicSlug}/${next._id}`
                    )
                  }
                >
                  Next Question
                </Button>
              ) : (
                <Alert severity="info">
                  You&apos;ve completed all questions in this topic!
                </Alert>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(15px); opacity: 0; }
          to   { transform: translateY(0);  opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default SolutionPage;
