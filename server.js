import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

import quizRoutes from './routes/quizRoutes.js';
import fluencyRoutes from './routes/fluencyRoutes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from public
app.use(express.static('public'));

// ✅ Mount correctly
app.use('/quiz', quizRoutes);      // All quiz routes start with /quiz
app.use('/fluency', fluencyRoutes); // All fluency routes start with /fluency

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
