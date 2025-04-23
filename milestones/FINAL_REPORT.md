# Final Report

**Project Title:** <br>
Stock Portfolio Tracker

**Team:** <br>
Ctrl Alt Elite

**Project Tracker:** <br>
https://trello.com/invite/b/67aa8dacedd351d2afd0c7ff/ATTI8e3263db6394dee75751de9975d9807881DF3439/team-3-ctrl-alt-elite

**Demo:**

**Version Control Repository:** <br>
https://github.com/ScottWilson1/Stock-Portfolio-Tracker.git

**Final Status Report:**
- What you completed <br>
With the final version of the stock tracking app, the homepage had a search bar for the user to interface with Yfinance and look up information about specific stocks. This information could be displayed in the stock details area of the homepage.  Next to the details display section was the watchlist section, with the user's saved stocks displayed as buttons.  When clicked, the stock details portion would be populated with details about that stock.  When a stock's displayed were displayed, interactive buttons would also become available. One button provided the ability to add or remove the displayed stock from the watchlist. Another "news" button would direct the user to a new page displaying recents articles about the stock as well as the most recent SEC filings for the stock.

- What you were in the middle of implementing <br>
For the homepage, the entirety of the minimum viable product was produced.

- What you had planned for the future <br>
The anticipated next features would have been additional information in the stock details window, such as a line graph demonstrating the stocks performance.

- Any known problems (bugs, issues)

**Tools** <br>
- Supabase <br>
Supabase is an opensource datbase hosting site chosen to store the data for this app. It was chosen for not only because it was free, but because it offered its users a prebuilt API with which to interect with it, the **supabase-js client library**.  The access the API offered that was used were methods to insert and delete data from the database (eg; new usernames and passwords, adding and removing stocks from watchlists), and query data in the database (eg; username and password validity, stocks associated with this user's watchlist.) Additional features this API offered that were anticiapted to be needed, but were not used were methods for more stringent user authentication. <br>

-Flask <br>
Flask was used to navigate between the various HTML pages of the app via route functions (eg; homepage, login page, documentation, account settings).  It also provided integration between the front end Javascript manipulating the user interface and the API layer providing the yFinance stock information.  Functions from the flask app would be "fetched" from Javascript, and these functions would in turn call the YFinance functions in the API layer.  The data from this would be returned as a python object (typically a dictionary), and converted to a Javascript usable JSON response by Flask before returning it to the Javascript. <br>

**Public Hosting Site**
