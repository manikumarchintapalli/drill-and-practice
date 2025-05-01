// src/components/AdminQuestionManager.tsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Alert,
  Stack,
  useTheme,
} from "@mui/material";
import {
  useAddCourseService,
  useAddTopicService,
  useCreateQuestionService,
  useDeleteQuestionService,
  useGetAllQuestionsService,
  useGetCoursesService,
  useGetTopicsService,
  useUpdateQuestionService,
} from "../api/apiServices";

export interface QuestionForm {
  _id?: string;
  topic: string;             // this holds the topic _id
  title: string;
  description: string;
  options: string[];
  answerIndex: number;
  difficulty: "Easy" | "Medium" | "Hard";
}

const AdminQuestionManager: React.FC = () => {
  const theme = useTheme();

  // --- Local state ---
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [newCourse, setNewCourse] = useState<string>("");
  const [newTopic, setNewTopic] = useState<string>("");
  const [topicMessage, setTopicMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [question, setQuestion] = useState<QuestionForm>({
    topic: "",
    title: "",
    description: "",
    options: ["", "", "", ""],
    answerIndex: 0,
    difficulty: "Medium",
  });

  // --- Data fetching ---
  const { data: courses = [] } = useGetCoursesService();
  const { data: topics = [] } = useGetTopicsService(selectedCourse);
  const {
    data: questions = [],
    refetch: refetchQuestions,
  } = useGetAllQuestionsService();

  // --- Mutations ---
  const addCourse = useAddCourseService();
  const addTopic = useAddTopicService();
  const createQuestion = useCreateQuestionService();
  const updateQuestion = useUpdateQuestionService();
  const deleteQuestion = useDeleteQuestionService();

  // --- Handlers ---
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addCourse.mutateAsync({ name: newCourse });
      setNewCourse("");
    } catch {
      alert("Course already exists or an error occurred.");
    }
  };

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      setTopicMessage({
        type: "error",
        text: "Please select a course first.",
      });
      return;
    }
    try {
      await addTopic.mutateAsync({
        name: newTopic.trim(),
        courseId: selectedCourse,
      });
      setNewTopic("");
      setTopicMessage({ type: "success", text: "Topic added successfully!" });
    } catch {
      setTopicMessage({
        type: "error",
        text: "Topic already exists or an error occurred.",
      });
    }
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.topic) {
      alert("Please select a topic before adding a question.");
      return;
    }
    if (editingId) {
      await updateQuestion.mutateAsync({ id: editingId, ...question });
      setEditingId(null);
    } else {
      await createQuestion.mutateAsync(question);
    }
    // reset form
    setQuestion({
      topic: "",
      title: "",
      description: "",
      options: ["", "", "", ""],
      answerIndex: 0,
      difficulty: "Medium",
    });
    refetchQuestions();
  };

  const handleEdit = (q: any) => {
    // match by _id, not by name
    const matchedTopic = topics.find((t) => t._id === q.topic);
    setQuestion({
      _id: q._id,
      topic: matchedTopic?._id || "",
      title: q.text,
      description: q.solution || "",
      options: q.options || ["", "", "", ""],
      answerIndex: q.answerIndex ?? 0,
      difficulty: (q.difficulty as "Easy" | "Medium" | "Hard") || "Medium",
    });
    setEditingId(q._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      await deleteQuestion.mutateAsync(id);
      refetchQuestions();
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    setQuestion({ ...question, options: newOptions });
  };

  // --- FIXED: compare IDs to IDs ---
  const filteredQuestions = questions.filter(
    (q) => q.topic === question.topic
  );

  // --- Render ---
  return (
    <Container maxWidth="md" sx={{ py: theme.spacing(5) }}>
      <Typography variant="h4" gutterBottom>
        Admin Question Manager
      </Typography>

      {/* Course Section */}
      <Paper sx={{ p: theme.spacing(3), mb: theme.spacing(4) }}>
        <Typography variant="h6">Select or Add Course</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: theme.spacing(2) }}>
          <TextField
            label="New Course Name"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleAddCourse}>
            Add
          </Button>
        </Stack>
        <FormControl fullWidth sx={{ mt: theme.spacing(2) }}>
          <InputLabel>Select Course</InputLabel>
          <Select
            value={selectedCourse}
            label="Select Course"
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setQuestion((q) => ({ ...q, topic: "" }));
            }}
          >
            <MenuItem value="">-- Select Course --</MenuItem>
            {courses.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Topic Section */}
      <Paper sx={{ p: theme.spacing(3), mb: theme.spacing(4) }}>
        <Typography variant="h6">Select or Add Topic</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: theme.spacing(2) }}>
          <TextField
            label="New Topic Name"
            value={newTopic}
            onChange={(e) => setNewTopic(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleTopicSubmit}>
            Add
          </Button>
        </Stack>
        <FormControl fullWidth sx={{ mt: theme.spacing(2) }}>
          <InputLabel>Select Topic</InputLabel>
          <Select
            value={question.topic}
            label="Select Topic"
            onChange={(e) =>
              setQuestion({ ...question, topic: e.target.value })
            }
          >
            <MenuItem value="">-- Select Topic --</MenuItem>
            {topics.map((t) => (
              <MenuItem key={t._id} value={t._id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {topicMessage && (
          <Alert
            severity={topicMessage.type}
            onClose={() => setTopicMessage(null)}
            sx={{ mt: theme.spacing(2) }}
          >
            {topicMessage.text}
          </Alert>
        )}
      </Paper>

      {/* Question Form */}
      <Paper sx={{ p: theme.spacing(3), mb: theme.spacing(4) }}>
        <Typography variant="h6">
          {editingId ? "Edit" : "Add"} Question
        </Typography>
        <Box
          component="form"
          onSubmit={handleQuestionSubmit}
          sx={{ mt: theme.spacing(2) }}
        >
          <TextField
            label="Title"
            value={question.title}
            onChange={(e) =>
              setQuestion({ ...question, title: e.target.value })
            }
            fullWidth
            sx={{ mb: theme.spacing(2) }}
          />
          <TextField
            label="Description"
            value={question.description}
            onChange={(e) =>
              setQuestion({ ...question, description: e.target.value })
            }
            fullWidth
            multiline
            rows={3}
            sx={{ mb: theme.spacing(2) }}
          />
          {question.options.map((opt, idx) => (
            <TextField
              key={idx}
              label={`Option ${idx + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              fullWidth
              sx={{ mb: theme.spacing(2) }}
            />
          ))}
          <TextField
            label="Correct Answer Index (0–3)"
            type="number"
            value={question.answerIndex}
            onChange={(e) =>
              setQuestion({
                ...question,
                answerIndex: parseInt(e.target.value, 10) || 0,
              })
            }
            fullWidth
            sx={{ mb: theme.spacing(2) }}
          />
          <FormControl fullWidth sx={{ mb: theme.spacing(2) }}>
            <InputLabel>Difficulty</InputLabel>
            <Select
              value={question.difficulty}
              label="Difficulty"
              onChange={(e) =>
                setQuestion({
                  ...question,
                  difficulty: e.target.value as "Easy" | "Medium" | "Hard",
                })
              }
            >
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" type="submit" fullWidth>
            {editingId ? "Update Question" : "Add Question"}
          </Button>
        </Box>
      </Paper>

      {/* Questions List */}
      {question.topic && (
        <Paper sx={{ p: theme.spacing(3) }}>
          <Typography variant="h6" gutterBottom>
            Questions for Selected Topic
          </Typography>
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => (
              <Box
                key={q._id}
                sx={{
                  border: `1px solid ${theme.palette.grey[300]}`,
                  borderRadius: theme.shape.borderRadius,
                  p: theme.spacing(2),
                  mb: theme.spacing(2),
                }}
              >
                <Typography fontWeight="bold">
                  {q.text} ({q.difficulty})
                </Typography>
                <Typography variant="body2" sx={{ mt: theme.spacing(1) }}>
                  {q.solution}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: theme.spacing(2) }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleEdit(q)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(q._id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
            ))
          ) : (
            <Typography>No questions yet for this topic.</Typography>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default AdminQuestionManager;