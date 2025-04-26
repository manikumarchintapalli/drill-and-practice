

// // routes/analyze.js
// import express from 'express';
// import axios from 'axios';

// const analyzeRoute = express.Router();

// analyzeRoute.post('/', async (req, res) => {
//   const { question, userAnswer, correctAnswer, assumption } = req.body;

//   // 1. Validate required fields
//   if (!question || !userAnswer || !correctAnswer || !assumption) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   const url = 'https://openrouter.ai/api/v1/chat/completions';
//   const body = {
//     model: 'openai/gpt-3.5-turbo',
//     messages: [
//       // you can customize the system message as needed
//       { role: 'system', content: 'You are an educational assistant that provides feedback.' },
//       {
//         role: 'user',
//         content:
//           `Question: ${question}\n` +
//           `User Answer: ${userAnswer}\n` +
//           `Correct Answer: ${correctAnswer}\n` +
//           `Assumption: ${assumption}`
//       }
//     ],
//     temperature: 0.7
//   };
//   const headers = {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
//   };

//   try {
//     // Allow all status codes through so we can handle non-200 manually
//     const response = await axios.post(url, body, {
//       headers,
//       validateStatus: () => true
//     });

//     // 2. Handle non-200 status codes
//     if (response.status !== 200) {
//       return res
//         .status(500)
//         .json({ error: 'OpenRouter API error', details: response.data });
//     }

//     const data = response.data;
//     // 3. Handle missing or empty choices
//     if (
//       !data.choices ||
//       !Array.isArray(data.choices) ||
//       data.choices.length === 0 ||
//       !data.choices[0].message ||
//       !data.choices[0].message.content
//     ) {
//       return res
//         .status(500)
//         .json({ error: 'Failed to generate feedback from AI.' });
//     }

//     // 4. All good — return the feedback
//     return res.status(200).json({ feedback: data.choices[0].message.content });
//   } catch (err) {
//     // 5. Network / unexpected errors
//     return res
//       .status(500)
//       .json({ error: 'Failed to generate feedback from AI.' });
//   }
// });

// export default analyzeRoute;

import express from 'express';
import axios from 'axios';

const analyzeRoute = express.Router();

analyzeRoute.post('/', async (req, res) => {
  const { question, userAnswer, correctAnswer, assumption } = req.body;

  if (!question || !userAnswer || !correctAnswer || !assumption) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OpenRouter API key' });
  }

  const url = 'https://openrouter.ai/api/v1/chat/completions';
  const body = {
    model: 'openai/gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are an educational assistant that provides feedback.' },
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
      validateStatus: () => true // allow non-200 through
    });

    if (response.status !== 200) {
      return res
        .status(500)
        .json({ error: 'OpenRouter API error', details: response.data });
    }

    const data = response.data;
    const feedback = data?.choices?.[0]?.message?.content;

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