import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.js';
import productsRouter from './routes/products.js';
import uploadRouter from './routes/upload.js';
import flyersRouter from './routes/flyers.js';

export function createApp() {
  const app = express();

  // Render (and most PaaS hosts) terminate TLS at a proxy and forward over
  // HTTP internally; without this, req.protocol/req.secure and X-Forwarded-*
  // headers aren't trusted, which can throw off IP-based logging/limiting.
  app.set('trust proxy', 1);

  app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
  app.use(express.json());

  app.use('/api/health', healthRouter);
  app.use('/api/products', productsRouter);
  app.use('/api/upload', uploadRouter);
  app.use('/api/flyers', flyersRouter);

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
