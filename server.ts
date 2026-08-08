import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import {
  generateAgentCollectiveService,
  chatWithAgentService,
  simulateCollectiveExecutionService,
} from './src/server/geminiService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/api/generate-collective', async (req, res) => {
  try {
    const result = await generateAgentCollectiveService(req.body);
    res.json(result);
  } catch (err: any) {
    console.error('Error generating collective:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate agents' });
  }
});

app.post('/api/agent-chat', async (req, res) => {
  try {
    const reply = await chatWithAgentService(req.body);
    res.json({ reply });
  } catch (err: any) {
    console.error('Error in agent chat:', err);
    res.status(500).json({ error: err?.message || 'Agent chat error' });
  }
});

app.post('/api/simulate-collective', async (req, res) => {
  try {
    const steps = await simulateCollectiveExecutionService(req.body);
    res.json({ steps });
  } catch (err: any) {
    console.error('Error simulating execution:', err);
    res.status(500).json({ error: err?.message || 'Simulation error' });
  }
});

// Serve static assets in production
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AXON.OS Server active on port ${PORT}`);
});
