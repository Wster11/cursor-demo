import axios from 'axios';

export default async function handler(req, res) {
  const { symbol } = req.query;
  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(endDate.getFullYear() - 20);

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?period1=${Math.floor(startDate.getTime() / 1000)}&period2=${Math.floor(endDate.getTime() / 1000)}&interval=1mo`;

  try {
    const response = await axios.get(url);
    const prices = response.data.chart.result[0].indicators.quote[0].close;
    const timestamps = response.data.chart.result[0].timestamp;

    const data = timestamps.map((timestamp, index) => ({
      date: new Date(timestamp * 1000).toISOString().split('T')[0],
      price: prices[index],
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stock data' });
  }
}