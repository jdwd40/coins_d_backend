import express from 'express';
import Coin from '../models/Coin.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all coins
router.get('/', auth, async (req, res) => {
  try {
    const coins = await Coin.find({});
    res.json(coins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching coins' });
  }
});

// Initialize coins (only for development)
router.post('/init', auth, async (req, res) => {
  try {
    // Clear existing coins
    await Coin.deleteMany({});

    const initialCoins = [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        currentPrice: 45000.00,
        marketCap: 850000000000,
        volume24h: 28000000000,
        priceChange24h: 2.5,
        circulatingSupply: 19000000,
        description: 'The original cryptocurrency that started it all.'
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        currentPrice: 2800.00,
        marketCap: 320000000000,
        volume24h: 15000000000,
        priceChange24h: 3.2,
        circulatingSupply: 120000000,
        description: 'The leading smart contract platform.'
      },
      {
        symbol: 'LUNA',
        name: 'Luna Coin',
        currentPrice: 150.00,
        marketCap: 15000000000,
        volume24h: 2000000000,
        priceChange24h: -1.8,
        circulatingSupply: 100000000,
        description: 'A revolutionary DeFi ecosystem token.'
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        currentPrice: 180.00,
        marketCap: 25000000000,
        volume24h: 3000000000,
        priceChange24h: 4.5,
        circulatingSupply: 139000000,
        description: 'High-performance blockchain platform.'
      },
      {
        symbol: 'ADA',
        name: 'Cardano',
        currentPrice: 2.20,
        marketCap: 70000000000,
        volume24h: 4000000000,
        priceChange24h: 1.2,
        circulatingSupply: 32000000000,
        description: 'Proof-of-stake blockchain platform.'
      },
      {
        symbol: 'DOT',
        name: 'Polkadot',
        currentPrice: 35.00,
        marketCap: 35000000000,
        volume24h: 2500000000,
        priceChange24h: -2.1,
        circulatingSupply: 1000000000,
        description: 'Multi-chain network for cross-chain transfers.'
      },
      {
        symbol: 'AVAX',
        name: 'Avalanche',
        currentPrice: 95.00,
        marketCap: 23000000000,
        volume24h: 1800000000,
        priceChange24h: 5.6,
        circulatingSupply: 242000000,
        description: 'Fast, low-cost, eco-friendly blockchain platform.'
      },
      {
        symbol: 'LINK',
        name: 'Chainlink',
        currentPrice: 28.00,
        marketCap: 13000000000,
        volume24h: 1200000000,
        priceChange24h: -0.8,
        circulatingSupply: 464000000,
        description: 'Decentralized oracle network.'
      },
      {
        symbol: 'ATOM',
        name: 'Cosmos',
        currentPrice: 42.00,
        marketCap: 12000000000,
        volume24h: 900000000,
        priceChange24h: 3.4,
        circulatingSupply: 286000000,
        description: 'Internet of Blockchains.'
      },
      {
        symbol: 'ALGO',
        name: 'Algorand',
        currentPrice: 1.80,
        marketCap: 11000000000,
        volume24h: 800000000,
        priceChange24h: 1.9,
        circulatingSupply: 6100000000,
        description: 'Pure proof-of-stake blockchain.'
      }
    ];

    await Coin.insertMany(initialCoins);
    res.json({ message: 'Coins initialized successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error initializing coins' });
  }
});

export default router;
