const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  priceCents: { type: Number, required: true },
  keywords: [String],
  image: { type: String, required: true },
  rating: {
    stars: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  prime: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  category: { type: String, default: 'General' }
});

module.exports = mongoose.model('Product', productSchema);