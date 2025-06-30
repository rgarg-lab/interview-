

import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/generate-question', async (req, res) => {
  const Topic = req.body.topic;
  const prompt = `Generate 10 multiple-choice interview questions on the topic: ${Topic}.

Each question must follow this strict format exactly:

<number>. <question text>
A. <option A>
B. <option B>
C. <option C>
D. <option D>
Answer: <correct option letter>

Make sure:
- Each line is on a new line (do NOT put options on the same line)
- There are no HTML tags or backticks
- Questions and options are clear and clean
-Start directly with questions without writing anything`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    const data = await response.json();
    console.log("🔍 Gemini RAW Response:", JSON.stringify(data, null, 2));

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (text) {
      res.json({ questions: text });
    } else {
      res.json({ questions: "No questions returned (empty or malformed response)" });
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to fetch from Gemini" });
  }
});

export default router;
