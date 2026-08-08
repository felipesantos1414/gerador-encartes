import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import healthRouter from './routes/health.js';
import productsRouter from './routes/products.js';
import uploadRouter from './routes/upload.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  app.use('/api/health', healthRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/upload', uploadRouter);

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
