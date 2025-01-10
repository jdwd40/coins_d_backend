import mongoose from 'mongoose';

const coinSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  previousPrice: {
    type: Number,
    default: null
  },
  marketCap: {
    type: Number,
    required: true
  },
  volume24h: {
    type: Number,
    required: true
  },
  priceChange24h: {
    type: Number,
    required: true
  },
  circulatingSupply: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Coin', coinSchema);
