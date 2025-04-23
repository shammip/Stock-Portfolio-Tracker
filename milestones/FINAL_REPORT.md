# Final Report

**Project Title:** Stock Portfolio Tracker

**Team:** Ctrl Alt Elite

**Project Tracker:** https://trello.com/invite/b/67aa8dacedd351d2afd0c7ff/ATTI8e3263db6394dee75751de9975d9807881DF3439/team-3-ctrl-alt-elite

**Demo:**

**Version Control Repository:** https://github.com/ScottWilson1/Stock-Portfolio-Tracker.git

**Public Hosting Site:** 

### Final Status Report:
**What you completed:** <br>
- With the final version of the stock tracking app, the homepage had a search bar for the user to interface with Yfinance and look up information about specific stocks. This information could be displayed in the stock details area of the homepage.  Next to the details display section was the watchlist section, with the user's saved stocks displayed as buttons.  When clicked, the stock details portion would be populated with details about that stock.  When a stock's displayed were displayed, interactive buttons would also become available. One button provided the ability to add or remove the displayed stock from the watchlist. Another "news" button would direct the user to a new page displaying recents articles about the stock as well as the most recent SEC filings for the stock.

**What you were in the middle of implementing:** <br>
- For the homepage, the entirety of the minimum viable product was produced.

**What you had planned for the future:** <br>
- Additional information in the stock details window, such as a line graph demonstrating the stocks performance.<br>
- Robust fall back mechanisms in the backend to gracefully handle failed API calls.<br>
- More frequent data retrieval with rotating proxies and cool-off periods to avoid blacklisting.<br>
- Connect user information with the Account Settings page so that the username and password (hidden by asterisk) would be displayed.<br>

**Any known problems (bugs, issues):**

### Tools: <br>

**Git Version Control and GitHub Project Repo:** <br>
- In the beginning, some team members created branches with their names and continued to work on their branch. Halfway through the project, the team decided that it would be better if we created branches based on the task at hand and after merging the branch, deleting it. This process really kept team members informed about what everyone was working on.<br>
- One team member was trying to merge their branch into main and they received a message saying that their work would be erased and the remaining team members supported by walking through the pull request steps during a weekly meeting.<br> 
- Some of the team members were apprehensive about merging their branch with the main branch in case the main branch stopped working correctly. To remedy this, it would be a good idea to have a developmental branch that team members can merge their branch into and then once the developmental branch was working correctly, it can be merged with the main branch. This allows the main branch to be always functioning as expected.<br> 

**Trello:** <br>

**Python:** <br>
- Libraries used included Edgartools (API wrapper of EDGAR), yfinance (3rd party library to access yahoo finance), Pandas, and Numpy. 4 functions were defined: get_stock_data(), get_watchlist_data(), get_stock_news(), get_stock_filings(). These allowed us to fetch in-depth information about a stock (get_stock_data), a truncated version of that information for the watchlist (get_watchlist_data), news articles related to a stock (get_stock_news), and any documents filed to the SEC by the companies (get_stock_filings). Additionally, the Python Unittest module was used to create unit tests along the way for each of the aforementioned functions, ensuring that the appropriate input and expected output were in alignment with our goals.

**Supabase:** <br>
- Supabase is an opensource database hosting site chosen to store the data for this app. It was chosen not only because it was free, but because it offered its users a prebuilt API with which to interact with, the **supabase-js client library**.  The access the API offered that was used were methods to insert and delete data from the database (eg; new usernames and passwords, adding and removing stocks from watchlists), and query data in the database (eg; username and password validity, stocks associated with this user's watchlist.) Additional features this API offered that were anticipated to be needed, but were not used were methods for more stringent user authentication. <br>

**Flask:** <br>
- Flask was used to navigate between the various HTML pages of the app via route functions (eg; homepage, login page, documentation, account settings). It also provided integration between the front end Javascript manipulating the user interface and the API layer providing the yFinance stock information. Functions from the flask app would be "fetched" from Javascript, and these functions would in turn call the YFinance functions in the API layer. The data from this would be returned as a python object (typically a dictionary), and converted to a Javascript usable JSON response by Flask before returning it to the Javascript. <br>

**HTML & CSS:** <br>
- HTML was used to structure web page layouts to define static and dynamic content. Static elements include page name, header, subheadings and search bar while dynamic content consists of user-specific data, such as stock information.
- CSS was used to style interface to maintain a consistent visual design across all web pages such as formatting for header and subheadings, while also implementing page-specific styling such as stock display rectangle on the homepage.
- In terms of the web page formatting, the styling was first implemented in the HTML files, then moved to each web page’s CSS file, then a global CSS file was created to keep the website format consistent, and finally Javascript was added to show dynamic content. This evolution of incorporating style into the website really made it easy to implement. Overall, HTML and CSS are great foundational tools for web development. <br>

**Javascript:** <br>

