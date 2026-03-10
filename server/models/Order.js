const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
});

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  customerName: { type: String, default: '' },
  customerPhone: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ['new', 'processing', 'completed', 'cancelled'],
    default: 'new',
  },
  comment: { type: String, default: '' },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
