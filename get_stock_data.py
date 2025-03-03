import yfinance as yf
import numpy as np
import re

# will be used to retrieve more details for when the user clicks on a stock or searches for a stock
def get_stock_details(ticker):
    stock_data = {}
    stock = yf.Ticker(ticker)
    hist = stock.history(period="2d")
    info = stock.info

    # will continue to add/remove here as we refine what it is that we want included in this section
    stock_data[ticker] = {
        "ticker": ticker,
        "cur_price": info['currentPrice'],
        "pct_change": ((hist['Close'].iloc[-1] - hist['Close'].iloc[-2]) / hist['Close'].iloc[-2]) * 100,
        "day_open": hist['Open'].iloc[-1],
        "day_low": hist['Low'].iloc[-1],
        "day_high": hist['High'].iloc[-1],
        "52wk_low": info['fiftyTwoWeekLow'],
        "52wk_high": info['fiftyTwoWeekHigh'],
        "market_cap": info['marketCap'],
        "curr_volume": info['volume'],
        "avg_volume": info['averageVolume']
    }

    return stock_data

# used only for the watchlist where a subset of information, namely ticker, price, and percent of change are depicted.
def get_watchlist_data(tickers):
    stocks_data = {}

    for ticker in tickers:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="2d")
        info = stock.info
        
        stocks_data[ticker] = {
            "ticker": ticker,
            "cur_price": info['currentPrice'],
            # maybe use pct_change to indicate red or green so that we can but the actual ppercentage where stock details is
            "pct_change": ((hist['Close'].iloc[-1] - hist['Close'].iloc[-2]) / hist['Close'].iloc[-2]) * 100
        }

    return stocks_data

# main function just used for testing at the moment.
def main(): 
    print("Single or multiple stocks? Type 's' for Single or 'm' for multiple.")
    answer = input().strip().lower()
    
    if answer == 's':
        print("Enter ticker symbol: ")
        ticker = input().strip().upper()
        stock_data = get_stock_details(ticker)
        print(stock_data)
    
    else:
        print("Enter ticker symbols: ")
        ticker_symbols = input().strip().upper()
        tickers = re.split(r'[,\s]+', ticker_symbols)  
        stock_data = get_watchlist_data(np.array(tickers))
        print(stock_data)
    
    
if __name__ == "__main__":
    main()
