import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'encartes', resource_type: 'image' },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

const router = Router();

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file provided' });

  try {
    const result = await uploadBuffer(req.file.buffer);
    res.status(201).json({ data: { url: result.secure_url } });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(502).json({ error: 'Image upload failed' });
  }
});

router.use((err, req, res, next) => {
  res.status(400).json({ error: err.message });
});

export default router;
