import mongoose from 'mongoose';

export const UNITS = ['un', 'kg', 'L', 'pct'];
export const CATEGORIES = ['bebidas', 'hortifruti', 'padaria', 'acougue', 'mercearia'];

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, enum: UNITS },
  category: { type: String, required: true, enum: CATEGORIES },
  imageUrl: { type: String, default: '' },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export default mongoose.model('Product', productSchema);
