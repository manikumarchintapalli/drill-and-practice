// src/components/AdminQuestionManager.tsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  useTheme,
} from "@mui/material";
import {
  useGetCoursesService,
  useAddCourseService,
  useGetTopicsService,
  useAddTopicService,
  useGetAllQuestionsService,
  useCreateQuestionService,
  useUpdateQuestionService,
  useDeleteQuestionService,
  type Course,
  type Topic,
} from "../api/apiServices";

// local form shape
export interface QuestionForm {
  _id?: string;
  topic: string;         // holds Topic._id
  title: string;
  description: string;
  options: string[];
  answerIndex: number;
  difficulty: "Easy" | "Medium" | "Hard"|"";
}

// API-returned shape
interface APIQuestion {
  _id: string;
  topic: string | Topic;
  title: string;
  description: string;
  options: string[];
  answerIndex: number;
  difficulty: "Easy"|"Medium"|"Hard";  
}

// helper to display topic name
const getTopicName = (t?: string | Topic): string =>
  typeof t === "string" ? t : t?.name ?? "";

const AdminQuestionManager: React.FC = () => {
  const theme = useTheme();

  // UI state
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [newCourse, setNewCourse] = useState<string>("");
  const [courseMessage, setCourseMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const [newTopic, setNewTopic] = useState<string>("");
  const [topicMessage, setTopicMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const [editingId, setEditingId] = useState<string | null>(null);

  // Question form state
  const [question, setQuestion] = useState<QuestionForm>({
    topic: "",
    title: "",
    description: "",
    options: ["", "", "", ""],
    answerIndex: -1,
    difficulty: "",
  });

  // API hooks
  const { data: courses = [], refetch: refetchCourses } = useGetCoursesService();
  const addCourse = useAddCourseService();

  const { data: topics = [] } = useGetTopicsService(selectedCourse);
  const addTopic = useAddTopicService();

  const { data: questions = [], refetch: refetchQuestions } =
    useGetAllQuestionsService();
  const createQuestion = useCreateQuestionService();
  const updateQuestion = useUpdateQuestionService();
  const deleteQuestion = useDeleteQuestionService();

  // — Handlers —

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newCourse.trim();
    if (!name) {
      setCourseMessage({ type: "error", text: "Course name cannot be empty." });
      return;
    }
    try {
      await addCourse.mutateAsync({ name });
      setCourseMessage({ type: "success", text: "Course added successfully!" });
      setNewCourse("");
      refetchCourses();
    } catch {
      setCourseMessage({
        type: "error",
        text: "Course already exists or an error occurred.",
      });
    }
  };

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newTopic.trim();
    if (!selectedCourse) {
      setTopicMessage({ type: "error", text: "Please select a course first." });
      return;
    }
    if (!name) {
      setTopicMessage({ type: "error", text: "Topic name cannot be empty." });
      return;
    }
    try {
      await addTopic.mutateAsync({ name, course: selectedCourse });
      setTopicMessage({ type: "success", text: "Topic added successfully!" });
      setNewTopic("");
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

  const handleEdit = (q: APIQuestion) => {
    const tid = typeof q.topic === "string" ? q.topic : q.topic._id;
    setQuestion({
      _id: q._id,
      topic: tid,
      title: q.title,
      description: q.description,
      options: q.options,
      answerIndex: q.answerIndex,
      difficulty: q.difficulty,
    });
    setEditingId(q._id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      await deleteQuestion.mutateAsync(id);
      refetchQuestions();
    }
  };

  const handleOptionChange = (idx: number, val: string) => {
    const opts = [...question.options];
    opts[idx] = val;
    setQuestion({ ...question, options: opts });
  };

  // filter questions to the selected topic
  const filteredQuestions = useMemo(() => {
    const topicName = topics.find((t) => t._id === question.topic)?.name;
    if (!topicName) return [];
    return questions.filter((q) => getTopicName(q.topic) === topicName);
  }, [questions, question.topic, topics]);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Admin Question Manager
      </Typography>

      {/* Course Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Select or Add Course</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="New Course Name"
            value={newCourse}
            onChange={(e) => {
              setNewCourse(e.target.value);
              setCourseMessage({ type: null, text: "" });
            }}
            fullWidth
          />
          <Button variant="contained" onClick={handleAddCourse}>
            Add
          </Button>
        </Stack>
        {courseMessage.text && (
          <Alert
            severity={courseMessage.type || "info"}
            onClose={() => setCourseMessage({ type: null, text: "" })}
            sx={{ mt: 2 }}
          >
            {courseMessage.text}
          </Alert>
        )}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="course-select-label"></InputLabel>
          <Select
            labelId="course-select-label"
            label="Select Course"
            displayEmpty
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value as string);
              setQuestion((q) => ({ ...q, topic: "" }));
            }}
          >
            <MenuItem value="" disabled>
              <em>Select Course</em>
            </MenuItem>
            {courses.map((c) => (
              <MenuItem key={c._id} value={c._id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Topic Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Select or Add Topic</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="New Topic Name"
            value={newTopic}
            onChange={(e) => {
              setNewTopic(e.target.value);
              setTopicMessage({ type: null, text: "" });
            }}
            fullWidth
          />
          <Button variant="contained" onClick={handleTopicSubmit}>
            Add
          </Button>
        </Stack>
        {topicMessage.text && (
          <Alert
            severity={topicMessage.type || "info"}
            onClose={() => setTopicMessage({ type: null, text: "" })}
            sx={{ mt: 2 }}
          >
            {topicMessage.text}
          </Alert>
        )}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="topic-select-label"></InputLabel>
          <Select
            labelId="topic-select-label"
            label="Select Topic"
            displayEmpty
            value={question.topic}
            onChange={(e) =>
              setQuestion({ ...question, topic: e.target.value as string })
            }
          >
            <MenuItem value="" disabled>
              <em>Select Topic</em>
            </MenuItem>
            {topics.map((t) => (
              <MenuItem key={t._id} value={t._id}>
                {t.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {/* Question Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">
          {editingId ? "Edit" : "Add"} Question
        </Typography>
        <Box component="form" onSubmit={handleQuestionSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Title"
            value={question.title}
            onChange={(e) =>
              setQuestion({ ...question, title: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
          />
          {question.options.map((opt, i) => (
            <TextField
              key={i}
              label={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => handleOptionChange(i, e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
          ))}

          {/* Correct Answer Select */}
          <FormControl fullWidth sx={{ mb: 2 }}>
  <InputLabel id="answer-select-label">Correct Answer</InputLabel>
  <Select
    labelId="answer-select-label"
    label="Correct Answer"
    displayEmpty
    value={question.answerIndex}
    onChange={(e) =>
      setQuestion({
        ...question,
        answerIndex: Number(e.target.value),
      })
    }
  >
    <MenuItem value={-1} disabled>
      <em>Select Correct Answer</em>
    </MenuItem>
    {question.options.map((_, idx) => (
      <MenuItem key={idx} value={idx}>
        Option {idx + 1}
      </MenuItem>
    ))}
  </Select>
</FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
  <InputLabel id="difficulty-select-label"></InputLabel>
  <Select
    labelId="difficulty-select-label"
    label="Difficulty"
    displayEmpty
    value={question.difficulty}
    onChange={(e) =>
      setQuestion({
        ...question,
        difficulty: e.target.value as QuestionForm["difficulty"],
      })
    }
  >
    <MenuItem value="" disabled>
      <em>Select Difficulty</em>
    </MenuItem>
    <MenuItem value="Easy">Easy</MenuItem>
    <MenuItem value="Medium">Medium</MenuItem>
    <MenuItem value="Hard">Hard</MenuItem>
  </Select>
</FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!question.topic}
          >
            {editingId ? "Update Question" : "Add Question"}
          </Button>
        </Box>
      </Paper>

      {/* Questions List */}
      {question.topic && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Questions for Selected Topic
          </Typography>
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((q) => (
              <Box
                key={q._id}
                sx={{
                  border: `1px solid ${theme.palette.grey[300]}`,
                  borderRadius: 1,
                  p: 2,
                  mb: 2,
                }}
              >
                <Typography fontWeight="bold">
                  {q.title} ({q.difficulty})
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {q.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
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