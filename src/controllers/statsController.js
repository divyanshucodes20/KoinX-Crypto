import Crypto from '../models/Crypto.js';

export const getLatestStats = async (req, res) => {
  try {
    const { coin } = req.query;

    if (!['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin name' });
    }

    const latestData = await Crypto.findOne({ coin }).sort({ timestamp: -1 });

    if (!latestData) {
      return res.status(404).json({ error: 'No data found' });
    }

    res.json({
      price: latestData.price,
      marketCap: latestData.marketCap,
      '24hChange': latestData.change24h,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


export const getPriceDeviation = async (req, res) => {
  try {
    const { coin } = req.query;

    if (!['bitcoin', 'matic-network', 'ethereum'].includes(coin)) {
      return res.status(400).json({ error: 'Invalid coin name' });
    }

    const records = await Crypto.find({ coin }).sort({ timestamp: -1 }).limit(100);

    if (records.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    const prices = records.map(record => record.price);
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
    const deviation = Math.sqrt(variance);

    res.json({ deviation: deviation.toFixed(2) });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
