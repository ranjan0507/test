import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8000;

app.use(cors({
  origin: "http://localhost:5174",
  credentials: true
}));

app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});
