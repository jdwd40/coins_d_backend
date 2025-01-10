import express from 'express';
import auth from '../middleware/auth.js';
import PriceHistory from '../models/PriceHistory.js';
import Coin from '../models/Coin.js';

const router = express.Router();

// Get price history for a coin
router.get('/:symbol/:timeframe', auth, async (req, res) => {
  try {
    const { symbol, timeframe } = req.params;
    
    // Find the coin by symbol
    const coin = await Coin.findOne({ symbol: symbol.toUpperCase() });
    if (!coin) {
      return res.status(404).json({ message: 'Coin not found' });
    }

    // Calculate the start date based on timeframe
    const startDate = new Date();
    switch (timeframe) {
      case '1m':
        startDate.setMinutes(startDate.getMinutes() - 1);
        break;
      case '3m':
        startDate.setMinutes(startDate.getMinutes() - 3);
        break;
      case '5m':
        startDate.setMinutes(startDate.getMinutes() - 5);
        break;
      case '10m':
        startDate.setMinutes(startDate.getMinutes() - 10);
        break;
      default:
        startDate.setMinutes(startDate.getMinutes() - 1); // Default to 1m
    }

    // Get price history
    const priceHistory = await PriceHistory.find({
      coinId: coin._id,
      timestamp: { $gte: startDate }
    })
    .sort({ timestamp: 1 })
    .select('price volume timestamp -_id');

    res.json(priceHistory);
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ message: 'Error fetching price history' });
  }
});

export default router;
