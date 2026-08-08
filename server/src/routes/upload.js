import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${suffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

const router = Router();

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file provided' });
  const base = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  res.status(201).json({ data: { url: `${base}/uploads/${req.file.filename}` } });
});

router.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

export default router;
