from flask import Flask, render_template, request, redirect, url_for
from get_stock_data import get_stock_news, get_stock_filings

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello World!"

app.route("/news")
def news_page(ticker):
    articles = get_stock_news(ticker)
    return render_template('news.html', ticker=ticker, articles=articles)