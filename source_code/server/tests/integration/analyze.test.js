// tests/integration/analyze.test.js
import express from "express";
import request from "supertest";
import { jest } from "@jest/globals";

//  Define the manual axios mock object before import
const mockAxios = {
  post: jest.fn(),
};

// Mock axios as an ESM module before importing analyzeRoute
jest.unstable_mockModule("axios", () => ({
  default: mockAxios,
}));

// Dynamic import after mocking
const { default: axios } = await import("axios");
const { default: analyzeRoute } = await import("../../routes/analyze.js");

// Setup Express app
const app = express();
app.use(express.json());
app.use("/api/analyze", analyzeRoute);

describe("Analyze Route Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.OPENROUTER_API_KEY = "test-api-key";
  });

  test("Should return 400 when missing required fields", async () => {
    const incompletePayloads = [
      {},
      { question: "Test question" },
      { question: "Test question", userAnswer: "User answer" },
      { question: "Test question", userAnswer: "User answer", correctAnswer: "Correct answer" },
      { question: "Test question", userAnswer: "User answer", assumption: "Assumption" },
      { correctAnswer: "Correct answer", userAnswer: "User answer", assumption: "Assumption" },
    ];

    for (const payload of incompletePayloads) {
      const response = await request(app).post("/api/analyze").send(payload);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "Missing required fields");
    }
  });

  test("Should successfully return feedback when all required fields are provided", async () => {
    const mockFeedback = "This is the AI feedback response";
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { choices: [{ message: { content: mockFeedback } }] },
    });

    const payload = {
      question: "What is normalization in DBMS?",
      userAnswer: "It is the process of organizing data to reduce redundancy.",
      correctAnswer: "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.",
      assumption: "I assumed that normalization only deals with redundancy.",
    };

    const response = await request(app).post("/api/analyze").send(payload);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("feedback", mockFeedback);
  });

  test("Should handle OpenRouter API error responses", async () => {
    axios.post.mockResolvedValueOnce({
      status: 401,
      data: { error: { code: 401, message: "No auth credentials found" } },
    });

    const payload = {
      question: "Q",
      userAnswer: "A ",
      correctAnswer: "C",
      assumption: "X",
    };
    const response = await request(app).post("/api/analyze").send(payload);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "OpenRouter API error");
    expect(response.body).toHaveProperty("details");
  });

  test("Should handle case when no feedback is received from AI", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { choices: [{ message: { content: "" } }] },
    });

    const payload = {
      question: "Q",
      userAnswer: "A",
      correctAnswer: "C",
      assumption: "X",
    };
    const response = await request(app).post("/api/analyze").send(payload);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Failed to generate feedback from AI.");
  });

  test("Should handle fetch (axios) exceptions properly", async () => {
    axios.post.mockRejectedValueOnce(new Error("Network error"));

    const payload = {
      question: "Q",
      userAnswer: "A",
      correctAnswer: "C",
      assumption: "X",
    };
    const response = await request(app).post("/api/analyze").send(payload);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "OpenRouter API error");
  });

  test("Should handle case when choices array is missing", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: {}, // no choices
    });

    const payload = {
      question: "Q",
      userAnswer: "A",
      correctAnswer: "C",
      assumption: "X",
    };
    const response = await request(app).post("/api/analyze").send(payload);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Failed to generate feedback from AI.");
  });

  test("Should handle case with missing API key", async () => {
    delete process.env.OPENROUTER_API_KEY;

    const payload = {
      question: "Q",
      userAnswer: "A",
      correctAnswer: "C",
      assumption: "X",
    };

    const response = await request(app).post("/api/analyze").send(payload);
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error");
    expect(axios.post).not.toHaveBeenCalled(); // Should NOT be called without API key
  });
});