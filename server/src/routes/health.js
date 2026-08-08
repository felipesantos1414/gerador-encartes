import { Router } from 'express';
import { dbStatus } from '../config/db.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ data: { status: 'ok', db: dbStatus() } });
});

export default router;
