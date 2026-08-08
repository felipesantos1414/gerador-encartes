import { Router } from 'express';
import Flyer from '../models/Flyer.js';

const router = Router();

router.get('/', async (req, res) => {
  const flyers = await Flyer.find().sort({ createdAt: -1 });
  res.json({ data: flyers });
});

router.get('/:id', async (req, res) => {
  try {
    const flyer = await Flyer.findById(req.params.id).populate('items.product');
    if (!flyer) return res.status(404).json({ error: 'Flyer not found' });
    res.json({ data: flyer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, themeId, validFrom, validUntil, storeName, items } = req.body;
    const flyer = await Flyer.create({ title, themeId, validFrom, validUntil, storeName, items });
    res.status(201).json({ data: flyer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, themeId, validFrom, validUntil, storeName, items } = req.body;
    const flyer = await Flyer.findByIdAndUpdate(
      req.params.id,
      { title, themeId, validFrom, validUntil, storeName, items },
      { new: true, runValidators: true },
    );
    if (!flyer) return res.status(404).json({ error: 'Flyer not found' });
    res.json({ data: flyer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const flyer = await Flyer.findByIdAndDelete(req.params.id);
    if (!flyer) return res.status(404).json({ error: 'Flyer not found' });
    res.json({ data: flyer });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
