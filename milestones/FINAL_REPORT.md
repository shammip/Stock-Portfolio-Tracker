# Final Report

**Project Title:** Stock Portfolio Tracker

**Team:** Ctrl Alt Elite

**Project Tracker:** <br>
https://trello.com/invite/b/67aa8dacedd351d2afd0c7ff/ATTI8e3263db6394dee75751de9975d9807881DF3439/team-3-ctrl-alt-elite

**Team members:** <br>
Brendan McDonald <br>
James Giannoni <br>
Shammi Pereira <br>
Jimmy Hundertmark <br>
Scott Wilson <br>

**Demo Video:** <br>
https://o365coloradoedu-my.sharepoint.com/:v:/g/personal/scwi7689_colorado_edu/EcaU8npahzZHiAU_m70iopAB-hjbN9ZM3ZnVeWsHMPd4qw?e=lFCrwC&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D <br>

**Version Control Repository:** <br>
https://github.com/ScottWilson1/Stock-Portfolio-Tracker.git <br>

**Public Hosting Site:** <br>
https://stock-portfolio-tracker-vu4z.onrender.com <br>

### Final Status Report:
**What you completed:** <br>
- With the final version of the stock tracking app, the homepage had a search bar for the user to interface with Yfinance and look up information about specific stocks. This information could be displayed in the stock details area of the homepage.  Next to the details display section was the watchlist section, with the user's saved stocks displayed as buttons.  When clicked, the stock details portion would be populated with details about that stock.  When a stock's displayed were displayed, interactive buttons would also become available. One button provided the ability to add or remove the displayed stock from the watchlist. Another "news" button would direct the user to a new page displaying recents articles about the stock as well as the most recent SEC filings for the stock.

Here's a list of the pages on our site and the functionality implemented on each: <br>

<ins>Stock homepage</ins> <br>
- Add stock to watchlist
- Remove stock from watchlist
- Search for stock by entering the stock symbol
- View stock details

<ins>Stock News page</ins> <br>
- Links to ten latest news articles about selected stock
- Links to the ten latest SEC filings for selected stock

<ins>Login page</ins> <br>
- Create a new account
- Login to existing account
- Error handling for entering the wrong password

<ins>Account Settings page</ins> <br>
- Display user account information (currently hardcoded)

<ins>Documentation page</ins> <br>
- List of the most important tools used to build the site
- FAQs for how to use the site

**What you were in the middle of implementing:** <br>
- For the homepage, the entirety of the minimum viable product was produced.

**What you had planned for the future:** <br>
- Additional information in the stock details window, such as a line graph demonstrating the stocks performance.<br>
- Robust fall back mechanisms in the backend to gracefully handle failed API calls.<br>
- More frequent data retrieval with rotating proxies and cool-off periods to avoid blacklisting.<br>
- Connect user information with the Account Settings page so that the username and password (hidden by asterisk) would be displayed. The user would also have the ability to reset their password.<br>

**Any known problems (bugs, issues):**
On the Login page, if you click the Login button when the username or password fields are empty, the user is logged out of the site. On the bright side, this bug ended up being a useful feature for testing.

### Tools: <br>

**Git Version Control and GitHub Project Repo:** <br>
- In the beginning, some team members created branches with their names and continued to work on their branch. Halfway through the project, the team decided that it would be better if we created branches based on the task at hand and after merging the branch, deleting it. This process really kept team members informed about what everyone was working on.<br>
- One team member was trying to merge their branch into main and they received a message saying that their work would be erased and the remaining team members supported by walking through the pull request steps during a weekly meeting.<br> 
- Some of the team members were apprehensive about merging their branch with the main branch in case the main branch stopped working correctly. To remedy this, it would be a good idea to have a developmental branch that team members can merge their branch into and then once the developmental branch was working correctly, it can be merged with the main branch. This allows the main branch to be always functioning as expected.
- Pull requests and code reviews were new to most of our team so we discussed what they were used for and how to implement them.
- In the future we would consider having a development branch in addition to the main branch. The main branch would serve as a backup in case a merge messed up the development branch.<br> 

**Trello:** <br>
- Trello worked well for organizing our small project, but we found we wanted functionality it didn't have, like organizing cards in sprints and the ability to link cards together. If we were to work on a larger project or have a larger project team we would need a project management tool with more functionality, like Jira or Azure.
- Every team member contributed to creating cards, but sometimes those cards took the other team members by surprise or were unclear. In hindsight, we should have had a label to distinguish new cards so we could have reviewed them as a team during standup.

**Slack** <br>
- Our team initially only communicated through email outside of our standup meetings, but we soon discovered that we needed a more realtime way of discussing project details. We set Slack for more casual communication and it was a huge help to keep us all on the same page, discuss important decisions, and get our team members unstuck.  

**Python:** <br>
- Libraries used included Edgartools (API wrapper of EDGAR), yfinance (3rd party library to access yahoo finance), Pandas, and Numpy. 4 functions were defined: get_stock_data(), get_watchlist_data(), get_stock_news(), get_stock_filings(). These allowed us to fetch in-depth information about a stock (get_stock_data), a truncated version of that information for the watchlist (get_watchlist_data), news articles related to a stock (get_stock_news), and any documents filed to the SEC by the companies (get_stock_filings). Additionally, the Python Unittest module was used to create unit tests along the way for each of the aforementioned functions, ensuring that the appropriate input and expected output were in alignment with our goals.

**Supabase:** <br>
- Supabase is an opensource database hosting site chosen to store the data for this app. It was chosen not only because it was free, but because it offered its users a prebuilt API with which to interact with, the **supabase-js client library**.  The access the API offered that was used were methods to insert and delete data from the database (eg; new usernames and passwords, adding and removing stocks from watchlists), and query data in the database (eg; username and password validity, stocks associated with this user's watchlist.) Additional features this API offered that were anticipated to be needed, but were not used were methods for more stringent user authentication. <br>

**Flask:** <br>
- Flask was used to navigate between the various HTML pages of the app via route functions (eg; homepage, login page, documentation, account settings). It also provided integration between the front end Javascript manipulating the user interface and the API layer providing the yFinance stock information. Functions from the flask app would be "fetched" from Javascript, and these functions would in turn call the YFinance functions in the API layer. The data from this would be returned as a python object (typically a dictionary), and converted to a Javascript usable JSON response by Flask before returning it to the Javascript. <br>

**HTML & CSS:** <br>
- HTML was used to structure web page layouts to define static and dynamic content. Static elements include page name, header, subheadings and search bar while dynamic content consists of user-specific data, such as stock information.
- CSS was used to style interface to maintain a consistent visual design across all web pages such as formatting for header and subheadings, while also implementing page-specific styling such as stock display rectangle on the homepage.
- In terms of the web page formatting, the styling was first implemented in the HTML files, then moved to each web page’s CSS file, then a global CSS file was created to keep the website format consistent, and finally Javascript was added to show dynamic content. This evolution of incorporating style into the website really made it easy to implement. Overall, HTML and CSS are great foundational tools for web development.
- The final result was a good-looking website, but multiple team members created their own CSS files with different styles. Later when we had to combine these files, some of pages looked inconsistent. We had to do extra work to make the styling cohesive across the entire site. In hindsight, we should have broken out creating a CSS file with a unified style into it's own task.<br>

**Javascript:** <br>
- JS files were written as frontend scripts to manipulate the GUI.  Javascript enabled dynamic features such as buttons (eg; news, add/remove stocks) that are available when needed and disappear when their fuctionality is not applicable.  The scripts were also written to post the data acquired by the API to the HTML pages.
- The API offered by Supabase, supabase-js client library, is also written in Javascript.  The functionality used from this API is discussed in the Supabase section of this report.

### Project Challenges:
