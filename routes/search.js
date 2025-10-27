const express = require('express');
const router = express.Router();

// Search stocks by query
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.length < 2) {
      return res.status(400).json({ message: 'Query must be at least 2 characters' });
    }

    console.log('Searching stocks for:', query);

    const fetch = (await import('node-fetch')).default;
    
    // Yahoo Finance search API
    const response = await fetch(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10&newsCount=0`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter and format results
    const results = data.quotes
      .filter(quote => 
        quote.quoteType === 'EQUITY' && 
        (quote.symbol.includes('.NS') || quote.symbol.includes('.BO') || !quote.symbol.includes('.'))
      )
      .map(quote => ({
        symbol: quote.symbol,
        name: quote.shortname || quote.longname || quote.symbol,
        exchange: quote.exchange,
        type: quote.quoteType
      }))
      .slice(0, 10);

    console.log(`Found ${results.length} results for "${query}"`);
    res.json({ results });
    
  } catch (error) {
    console.error('Error searching stocks:', error.message);
    res.status(500).json({ message: 'Failed to search stocks', error: error.message });
  }
});

module.exports = router;
