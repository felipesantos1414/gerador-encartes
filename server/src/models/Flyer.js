import mongoose from 'mongoose';

const flyerItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  overridePrice: { type: Number, min: 0 },
}, { _id: false });

const flyerSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  themeId: { type: String, required: true },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  storeName: { type: String, required: true, trim: true },
  items: { type: [flyerItemSchema], validate: (v) => v.length > 0 },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

export default mongoose.model('Flyer', flyerSchema);
