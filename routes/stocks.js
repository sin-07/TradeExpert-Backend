const express = require('express');
const router = express.Router();

// Proxy route for Indian stock prices (to avoid CORS issues)
router.get('/indian-stocks', async (req, res) => {
  try {
    const { symbols } = req.query;
    
    if (!symbols) {
      return res.status(400).json({ message: 'Symbols parameter required' });
    }

    console.log('Fetching Indian stocks:', symbols);

    const fetch = (await import('node-fetch')).default;
    const symbolList = symbols.split(',');
    
    // Fetch each symbol individually and combine results
    const promises = symbolList.map(async (symbol) => {
      try {
        const response = await fetch(
          `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json'
            }
          }
        );
        
        if (!response.ok) return null;
        
        const data = await response.json();
        
        if (data.chart && data.chart.result && data.chart.result[0]) {
          const result = data.chart.result[0];
          const meta = result.meta;
          
          return {
            symbol: symbol,
            regularMarketPrice: meta.regularMarketPrice || meta.previousClose,
            previousClose: meta.previousClose,
            regularMarketChangePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100),
            regularMarketDayHigh: meta.regularMarketDayHigh,
            regularMarketDayLow: meta.regularMarketDayLow,
            regularMarketOpen: meta.regularMarketOpen,
            regularMarketVolume: meta.regularMarketVolume,
            shortName: symbol.replace('.NS', '').replace('.BO', '')
          };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
        return null;
      }
    });
    
    const results = await Promise.all(promises);
    const validResults = results.filter(r => r !== null);
    
    console.log(`Successfully fetched ${validResults.length}/${symbolList.length} stocks`);
    
    res.json({
      quoteResponse: {
        result: validResults
      }
    });
    
  } catch (error) {
    console.error('Error fetching stock data:', error.message);
    res.status(500).json({ message: 'Failed to fetch stock data', error: error.message });
  }
});

// Proxy route for US stock prices (to avoid CORS issues)
router.get('/us-stocks', async (req, res) => {
  try {
    const { symbols } = req.query;
    
    if (!symbols) {
      return res.status(400).json({ message: 'Symbols parameter required' });
    }

    console.log('Fetching US stocks:', symbols);

    const fetch = (await import('node-fetch')).default;
    const symbolList = symbols.split(',');
    
    // Fetch each symbol individually
    const promises = symbolList.map(async (symbol) => {
      try {
        const response = await fetch(
          `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/json'
            }
          }
        );
        
        if (!response.ok) return null;
        
        const data = await response.json();
        
        if (data.chart && data.chart.result && data.chart.result[0]) {
          const result = data.chart.result[0];
          const meta = result.meta;
          
          return {
            symbol: symbol,
            regularMarketPrice: meta.regularMarketPrice || meta.previousClose,
            previousClose: meta.previousClose,
            regularMarketChangePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100),
            regularMarketDayHigh: meta.regularMarketDayHigh,
            regularMarketDayLow: meta.regularMarketDayLow,
            regularMarketOpen: meta.regularMarketOpen,
            regularMarketVolume: meta.regularMarketVolume,
            shortName: symbol
          };
        }
        return null;
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
        return null;
      }
    });
    
    const results = await Promise.all(promises);
    const validResults = results.filter(r => r !== null);
    
    console.log(`Successfully fetched ${validResults.length}/${symbolList.length} US stocks`);
    
    res.json({
      quoteResponse: {
        result: validResults
      }
    });
    
  } catch (error) {
    console.error('Error fetching US stock data:', error.message);
    res.status(500).json({ message: 'Failed to fetch US stock data', error: error.message });
  }
});

// Proxy route for historical chart data (to avoid CORS issues)
router.get('/historical', async (req, res) => {
  try {
    const { symbol, interval, range } = req.query;
    
    if (!symbol) {
      return res.status(400).json({ message: 'Symbol parameter required' });
    }

    const validInterval = interval || '5m';
    const validRange = range || '1d';

    console.log(`Fetching historical data for ${symbol}: interval=${validInterval}, range=${validRange}`);

    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(
      `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${validInterval}&range=${validRange}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`Successfully fetched historical data for ${symbol}`);
    
    // Return the raw Yahoo Finance response
    res.json(data);
    
  } catch (error) {
    console.error('Error fetching historical data:', error.message);
    res.status(500).json({ message: 'Failed to fetch historical data', error: error.message });
  }
});

module.exports = router;
