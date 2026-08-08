import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.get('/', async (req, res) => {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json({ data: products });
});

router.post('/', async (req, res) => {
  try {
    const { name, price, unit, category, imageUrl } = req.body;
    const product = await Product.create({ name, price, unit, category, imageUrl });
    res.status(201).json({ data: product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, price, unit, category, imageUrl } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, unit, category, imageUrl },
      { new: true, runValidators: true },
    );
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ data: product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ data: product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
