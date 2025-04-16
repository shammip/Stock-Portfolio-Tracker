import unittest
import pandas as pd
from get_stock_data import get_stock_details, get_watchlist_data, get_stock_news, get_stock_filings

class TestStockFunctions(unittest.TestCase):

    # checks that a valid ticker is passed and the result we get is a dictionary
    def test_get_stock_details(self):
        result = get_stock_details('AMD')
        self.assertIn('ticker_symbol', result)
        self.assertEqual(result['ticker_symbol'], 'AMD')
        self.assertIsInstance(result, dict)
    
    # if invalid ticker is used, it won't cause a crash
    def test_get_stock_details_invalid(self):
        result = get_stock_details('BADTICKER123')
        self.assertIn('error', result)
    
    # same as first function but for multiple tickers
    def test_get_watchlist_data(self):
        tickers = ['AMD', 'NVDA']
        result = get_watchlist_data(tickers)
        self.assertIsInstance(result, dict)
        for ticker in tickers:
            self.assertIn(ticker, result)
    
    # takes care of the instance where there are a mix of good and bad tickers
    def test_get_watchlist_data_partial_failure(self):
        tickers = ['AMD', 'BAD123']
        result = get_watchlist_data(tickers)
        self.assertIn('AMD', result)
        self.assertIn('BAD123', result)
        self.assertIn('error', result['BAD123'])

    # verify existence of list and return of list of dictionaries
    def test_get_stock_news(self):
        news = get_stock_news('AMD')
        self.assertIsInstance(news, list)
        self.assertTrue(all(isinstance(article, dict) for article in news))

    # verify return of dataframe with expected columns
    def test_get_stock_filings(self):
        result = get_stock_filings('test@example.com', 'AMD')
        self.assertIsInstance(result, pd.DataFrame)
        self.assertTrue('document_url' in result.columns or 'error' in result.columns)

if __name__ == '__main__':
    unittest.main()