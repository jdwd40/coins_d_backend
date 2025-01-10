import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema({
  coinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coin',
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true // Add index for better query performance
  }
});

// Create a compound index for efficient queries
priceHistorySchema.index({ coinId: 1, timestamp: -1 });

export default mongoose.model('PriceHistory', priceHistorySchema);
