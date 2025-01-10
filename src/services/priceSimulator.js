import Coin from '../models/Coin.js';
import PriceHistory from '../models/PriceHistory.js';

const VOLATILITY = 0.05; // 5% maximum price change
const UPDATE_INTERVAL = 20000; // 20 seconds

function getRandomPriceChange(currentPrice) {
  const maxChange = currentPrice * VOLATILITY;
  return (Math.random() - 0.5) * 2 * maxChange;
}

async function updateCoinPrices() {
  try {
    const coins = await Coin.find({});
    const updates = await Promise.all(coins.map(async (coin) => {
      const priceChange = getRandomPriceChange(coin.currentPrice);
      const newPrice = Math.max(0.01, coin.currentPrice + priceChange);
      
      // Calculate 24h change based on new price
      const priceChange24h = ((newPrice - coin.currentPrice) / coin.currentPrice) * 100;
      
      // Update volume (random increase between 0-2% of current volume)
      const volumeChange = coin.volume24h * (Math.random() * 0.02);
      const newVolume = coin.volume24h + volumeChange;

      // Update market cap based on new price
      const newMarketCap = newPrice * coin.circulatingSupply;

      // Record price history
      await PriceHistory.create({
        coinId: coin._id,
        price: newPrice,
        volume: newVolume
      });

      const updatedCoin = await Coin.findByIdAndUpdate(
        coin._id,
        {
          currentPrice: newPrice,
          priceChange24h: priceChange24h,
          volume24h: newVolume,
          marketCap: newMarketCap,
          previousPrice: coin.currentPrice // Store previous price for trend
        },
        { new: true }
      );

      return updatedCoin;
    }));

    return updates;
  } catch (error) {
    console.error('Error updating coin prices:', error);
    return [];
  }
}

// Clean up old price history data (keep last 7 days)
async function cleanupOldPriceHistory() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 7);
  
  try {
    await PriceHistory.deleteMany({
      timestamp: { $lt: cutoffDate }
    });
  } catch (error) {
    console.error('Error cleaning up old price history:', error);
  }
}

let simulatorInterval;
let cleanupInterval;

export function startPriceSimulator(io) {
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
  }

  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }

  simulatorInterval = setInterval(async () => {
    const updatedCoins = await updateCoinPrices();
    if (updatedCoins.length > 0) {
      io.emit('prices-updated', updatedCoins);
    }
  }, UPDATE_INTERVAL);

  // Run cleanup every 12 hours
  cleanupInterval = setInterval(cleanupOldPriceHistory, 12 * 60 * 60 * 1000);

  return simulatorInterval;
}

export function stopPriceSimulator() {
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
  }
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
  }
}
