import express from 'express';
import axios from 'axios';

const router = express.Router();

const pistonLanguageVersions = {
  cpp: { lang: 'cpp', version: '10.2.0' },
  python: { lang: 'python', version: '3.10.0' },
  java: { lang: 'java', version: '15.0.2' },
  javascript: { lang: 'javascript', version: '15.10.0' }
};

const fileExtensions = {
  cpp: 'cpp',
  python: 'py',
  java: 'java',
  javascript: 'js'
};

// 🚀 Run code with test cases
router.post('/run', async (req, res) => {
  const { language, code, testCases } = req.body;
  const config = pistonLanguageVersions[language];

  if (!config) return res.status(400).json({ error: 'Unsupported language' });

  const ext = fileExtensions[language];
  const results = [];

  for (const { input, expected } of testCases) {
    try {
      const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
        language: config.lang,
        version: config.version,
        files: [{ name: `main.${ext}`, content: code }],
        stdin: input
      });

      const { stdout, stderr } = response.data.run;
      const output = (stdout || '').trim();
      const error = (stderr || '').trim();

      results.push({
        input,
        expected,
        actual: output,
        passed: output === expected.trim(),
        error: error || null
      });

    } catch (err) {
      results.push({
        input,
        expected,
        actual: '',
        passed: false,
        error: err.response?.data?.message || err.message
      });
    }
  }

  res.json({ results });
});

// ✨ Gemini: Generate coding questions
router.post('/coding-questions', async (req, res) => {
  const topic = req.body.topic;

  const prompt = `Generate 3 coding interview questions on the topic: ${topic}.
Each question must be returned in strict JSON format like this:
{
  "question": "Write a program to ...\\nExample:\\nInput: 5\\n1 2 3 4 5\\nOutput: 2 4 6 8 10",
  "input": ["5\\n1 2 3 4 5", "4\\n10 20 30 40", "3\\n2 4 6", "6\\n0 1 2 3 4 5", "5\\n9 8 7 6 5", "2\\n100 200", "1\\n99"],
  "expected": ["2 4 6 8 10", "20 40 60 80", "4 8 12", "0 2 4 6 8 10", "18 16 14 12 10", "200 400", "198"]
}

Strict rules:
- Return exactly 3 such question objects inside a single JSON array.
- Each "question" must have **exactly one clear example** using Input: and Output:.
- Each "input" is a single line: "(n)\\n(array)"
- Each "expected" is a flat space-separated number string.
- Do NOT include explanations, markdown, or any extra text.
- Just return JSON array. Start with [ ... ]`;

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
    res.json({ result: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from Gemini" });
  }
});

export default router;
