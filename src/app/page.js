"use client";

import { useState, useEffect } from 'react';
import StockChart from './components/StockChart';

export default function Home() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference on initial load
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) {
      alert('Please enter a stock symbol');
      return;
    }
    try {
      const response = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol.trim())}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const data = await response.json();
      setStockData(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch stock data. Please try again.');
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Stock Market Tracker</h1>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded ${darkMode ? 'bg-white text-black' : 'bg-gray-800 text-white'}`}
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mb-8">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className={`p-2 border rounded mr-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded">
            Search
          </button>
        </form>
        {stockData && <StockChart data={stockData} darkMode={darkMode} />}
      </main>
    </div>
  );
}
