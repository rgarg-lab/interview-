// routes/fluencyRoutes.js

import express from 'express';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// Multer config
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 },
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', apiKey: !!process.env.ASSEMBLYAI_API_KEY });
});

// Upload and transcribe audio
router.post('/upload-audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file received' });

    const uploadRes = await axios.post(
      'https://api.assemblyai.com/v2/upload',
      fs.createReadStream(req.file.path),
      {
        headers: {
          authorization: process.env.ASSEMBLYAI_API_KEY,
          'content-type': 'application/octet-stream',
        },
      }
    );

    const transcriptRes = await axios.post(
      'https://api.assemblyai.com/v2/transcript',
      {
        audio_url: uploadRes.data.upload_url,
        punctuate: true,
        format_text: true,
      },
      {
        headers: { authorization: process.env.ASSEMBLYAI_API_KEY },
      }
    );

    res.json({ id: transcriptRes.data.id, status: 'processing' });
  } catch (err) {
    console.error('Upload Error:', err.message);
    res.status(500).json({ error: 'Upload failed' });
  } finally {
    if (req.file?.path) fs.unlinkSync(req.file.path);
  }
});

// Poll transcript
router.get('/transcript/:id', async (req, res) => {
  try {
    const response = await axios.get(`https://api.assemblyai.com/v2/transcript/${req.params.id}`, {
      headers: { authorization: process.env.ASSEMBLYAI_API_KEY },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve transcript' });
  }
});

// Generate 3 questions for fluency
router.post('/generate-questionaudio', async (req, res) => {
  const Topic = req.body.audio_topic;
  const prompt = `Generate 3 top interview questions on the topic: ${Topic}.
1. <question>
2. <question>
3. <question>
Only return the questions, no extra text.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const questions = rawText
      .split('\n')
      .filter((line) => /^\d+\.\s+/.test(line))
      .map((line) => line.trim());

    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: 'Gemini API failed' });
  }
});

// Evaluate responses
router.post('/generate-feedback', async (req, res) => {
  const { audio_questions, audio_answers } = req.body;

  if (!Array.isArray(audio_questions) || !Array.isArray(audio_answers)) {
    return res.status(400).json({ error: 'Invalid input format' });
  }

  const evaluations = [];

  for (let i = 0; i < audio_questions.length; i++) {
    const prompt = `You are an expert technical interviewer.

Evaluate the following answer:

Question: ${audio_questions[i]}
Answer: ${audio_answers[i]}

---
Respond ONLY in this format:
a) <score out of 10>
b) <1-line feedback>

Example:
a) 8/10
b) Good answer but could be more detailed.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();
    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const score = raw.split('\n').find((l) => l.startsWith('a)')) || '';
    const feedback = raw.split('\n').find((l) => l.startsWith('b)')) || '';

    evaluations.push({ score, feedback });
  }

  res.json({ evaluations });
});

export default router;
