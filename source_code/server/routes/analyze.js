import express from 'express';
import axios from 'axios';

const analyzeRoute = express.Router();

analyzeRoute.post('/', async (req, res) => {
  const { question, userAnswer, correctAnswer, assumption } = req.body;

  if (!question || !userAnswer || !correctAnswer || !assumption) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = "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"; // your actual key
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenRouter API key' });
  }

  const url = 'https://openrouter.ai/api/v1/chat/completions';
  const body = {
    model: 'openai/gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content:
        `You are an educational assistant that provides in-depth feedback on SQL questions.\n` +
        `1. First, check whether the user’s assumption is actually relevant to solving the question. ` +
        `Highlight the Topic and Give Why the given assumption is wrong\n` +
        `2. Then give a more detailed theoretical explanation of why the correct answer is correct.\n` +
        `3. Do NOT include any generic closing like “If you have any further questions…”.\n` +
        `4. End your response with exactly: Correct Answer: ${correctAnswer}`
      },
      {
        role: 'user',
        content:
          `Question: ${question}\n` +
          `User Answer: ${userAnswer}\n` +
          `Correct Answer: ${correctAnswer}\n` +
          `Assumption: ${assumption}`
      }
    ],
    temperature: 0.7
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  try {
    const response = await axios.post(url, body, {
      headers,
      validateStatus: () => true
    });

    if (response.status !== 200) {
      return res
        .status(500)
        .json({ error: 'OpenRouter API error', details: response.data });
    }

    const feedback = response.data.choices?.[0]?.message?.content;
    if (!feedback) {
      return res
        .status(500)
        .json({ error: 'Failed to generate feedback from AI.' });
    }

    return res.status(200).json({ feedback });
  } catch (err) {
    console.error('❌ Analyze route error:', err?.response?.data || err.message);
    return res
      .status(500)
      .json({ error: 'OpenRouter API error', details: err?.response?.data || err.message });
  }
});

export default analyzeRoute;