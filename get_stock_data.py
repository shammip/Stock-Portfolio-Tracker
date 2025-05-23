import yfinance as yf # pip install yfinance
from edgar import Company, set_identity, get_filings # "pip install edgartools"
import pandas as pd
import numpy as np
import re

'''
To test out the functions to see what they are returning, go to the bottom and 
put your email in the placeholder inside the Main function.
'''

# will be used to retrieve more details on a given stock
def get_stock_details(ticker):
    try:
        stock = yf.Ticker(ticker)
        info = stock.info
        hist = stock.history(period="5d").dropna()

        # get the last two available rows even if there's a weekend or holiday
        if len(hist) < 2:
            raise ValueError("Not enough data to calculate.")
        else:
            last_two_days = hist.tail(2)


        # helper function to get annual revenue
        def get_annual_revenue(stock):
            try:
                income_stmt = stock.income_stmt
                latest_date = income_stmt.columns[0]
                latest_revenue = income_stmt.loc["Total Revenue", latest_date]
                return latest_revenue # this will always be for the year prior to current year. It is now 2025 so it will be for 2024
            except Exception:
                return None
            
        stock_data = {
            "ticker_symbol": ticker,
            "company_name": info["displayName"] if "displayName" in info else None,
            "industry": info["industry"] if "industry" in info else None,
            "cur_price": info["currentPrice"] if "currentPrice" in info else None,
            "pct_change": ((last_two_days['Close'].iloc[-1] - last_two_days['Close'].iloc[-2]) / last_two_days['Close'].iloc[-2]) * 100,
            "day_open": hist['Open'].iloc[-1] if 'Open' in hist.columns else None,
            "day_low": hist['Low'].iloc[-1] if 'Low' in hist.columns else None,
            "day_high": hist['High'].iloc[-1] if 'High' in hist.columns else None,
            "52wk_low": info["fiftyTwoWeekLow"] if "fiftyTwoWeekLow" in info else None,
            "52wk_high": info["fiftyTwoWeekHigh"] if "fiftyTwoWeekHigh" in info else None,
            "market_cap": info["marketCap"] if "marketCap" in info else None,
            "curr_volume": info["volume"] if "volume" in info else None,
            "avg_volume": info["averageVolume"] if "averageVolume" in info else None,
            "annual_revenue": get_annual_revenue(stock)
        }
        
        # truncate certain values
        for key in ['pct_change', 'day_open', 'day_low', 'day_high']:
            if stock_data[key] is not None:
                stock_data[key] = round(stock_data[key], 2)
        
        return stock_data # dictionary
    
    except Exception as e:
        return {f"Could not fetch details for {ticker}: {str(e)}"}


# used only for the watchlist where a subset of information, namely ticker, price, and percent of change are depicted.
def get_watchlist_data(tickers):
    stocks_data = {}

    for ticker in tickers:
        try:
            stock = yf.Ticker(ticker)
            info = stock.info
            hist = stock.history(period="5d").dropna()

            # get the last two available rows even if there's a weekend or holiday
            if len(hist) < 2:
                raise ValueError("Not enough data to calculate.")
            else:
                last_two_days = hist.tail(2)
            
            # truncate pct_change first
            pct_change = ((last_two_days['Close'].iloc[-1] - last_two_days['Close'].iloc[-2]) / last_two_days['Close'].iloc[-2]) * 100
            pct_change = round(pct_change, 2)
            
            stocks_data[ticker] = {
                "ticker_symbol": ticker,
                "cur_price": info["currentPrice"] if "currentPrice" in info else None,
                "pct_change": pct_change
            }
        except Exception as e:
            stocks_data[ticker] = {f"Could not fetch details for {ticker}: {str(e)}"}

    return stocks_data # dictionary of dictionaries (stonks(stonk: stuff about stonk))


# uses yfinance news method which fetches articles from different publications
def get_stock_news(ticker):
    try:
        stock = yf.Ticker(ticker)
        news = stock.news[:10]  # get only 10

        filtered_news = []
        for article in news:
            content = article.get('content', {})
            filtered_article = {
                'title': content.get('title'),
                'url': content.get('canonicalUrl', {}).get('url'),
                'publisher': content.get('provider', {}).get('displayName'),
                'pubDate': content.get('pubDate')
            }
            filtered_news.append(filtered_article)

        return filtered_news # list of dictionaries
    
    except Exception as e:
        return [{f"Could not fetch news for {ticker}: {str(e)}"}]


# uses edgartools to extract SEC filing documents - fake email address hard coded
def get_stock_filings(ticker, userEmail='stocktracker@gmail.com'):
    try:
        set_identity(userEmail)
        ticker_symbol = Company(ticker)
        filings = ticker_symbol.get_filings()
        df = filings.to_pandas()
        df = df[['filing_date', 'primaryDocDescription', 'primaryDocument', 'accession_number']].head(10)

        # create full urls 
        df['document_url'] = df.apply(
            lambda row: f"https://www.sec.gov/Archives/edgar/data/{str(ticker_symbol.cik).replace('-', '')}/{str(row['accession_number']).replace('-', '')}/{row['primaryDocument']}",
            axis=1
        )

        #rename columns to simpler names
        df = df.rename(columns ={
            'filing_date': 'date',
            'primaryDocDescription': 'description',
            'document_url': 'url'
        })

        # remove accession_number
        # return dataframe converted to a dictionary
        return df[['date', 'description', 'url']].to_dict(orient='records')
    
    except Exception as e:
        return pd.DataFrame([{f"Could not fetch filings for {ticker}: {str(e)}"}])

    
# main function used for testing / debugging only
def main(): 
    print("Single or multiple stocks? Type 's' for Single or 'm' for multiple.")
    answer = input().strip().lower()
    
    if answer == 's':
        print("Enter ticker symbol: ")
        ticker = input().strip().upper()
        stock_data = get_stock_details(ticker)
        stock_news = get_stock_news(ticker)
        stock_filings = get_stock_filings(ticker)
        print(stock_data) 
        print()
        print(stock_filings)
        print()
        
        # helps depict what get_stock_news() is doing
        for article in stock_news:
            print('TITLE: ', {article['title']}) 
            print('PUBLISHER: ', {article['publisher']})      
            print('URL: ', {article['url']})
            print('PUB DATE: ', {article['pubDate']})
    
    else:
        print("Enter ticker symbols: ")
        ticker_symbols = input().strip().upper()
        tickers = re.split(r'[,\s]+', ticker_symbols)  
        stock_data = get_watchlist_data(np.array(tickers))
        print(stock_data)
    
    
if __name__ == "__main__":
    main()
