import cron from 'node-cron';
import axios from 'axios';
import Crypto from '../models/Crypto.js';

const fetchCryptoData = async () => {
  try {
    console.log('Cron job started at:', new Date());
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,matic-network,ethereum',
        vs_currencies: 'usd',
        include_market_cap: true,
        include_24hr_change: true,
      },
    });

    const data = response.data;
    const coins = ['bitcoin', 'matic-network', 'ethereum'];

    for (const coin of coins) {
      await Crypto.create({
        coin,
        price: data[coin]?.usd,
        marketCap: data[coin]?.usd_market_cap || 0,
        change24h: data[coin]?.usd_24h_change || 0,
      });
    }

    console.log('Crypto data fetched and saved to the database');
  } catch (error) {
    console.error('Error fetching crypto data:', error);
  }
};
const cronJob = () => {
  cron.schedule('0 */2 * * *', fetchCryptoData);
};

export default cronJob;
