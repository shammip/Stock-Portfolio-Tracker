### #1. Homepage

* Page Title: 
* Page Description (include a mockup or hand drawn image of the page): 
* Parameters needed for the page: 
* Data needed to render the page: 
* Link destinations for the page: 
* List of tests for verifying the rendering of the page: 

### #2. Login 

* Page Title: 
* Page Description (include a mockup or hand drawn image of the page): 
* Parameters needed for the page: 
* Data needed to render the page: 
* Link destinations for the page: 
* List of tests for verifying the rendering of the page: 

### #3. Account Settings

* Page Title: Account Settings
* Page Description (include a mockup or hand drawn image of the page): This page contains the account details of the user (name, username, email) as well as account related actions (update username, email, password as well as log out and delete account). ![Account Settings Design](images/account_settings_design.png).
* Parameters needed for the page: name, username, email, password
* Data needed to render the page: name, username, email, password
* Link destinations for the page: clicking 'Stock Portfolio Tracker' leads to Homepage, clicking 'Logout' or 'Delete Account' leads to Login page
* List of tests for verifying the rendering of the page: correctly display all user information, logging out or deleting account leads to being redirected to the Login page, clicking 'Stock Portfolio Tracker' leads to Homepage and able to update username, email id and password

### #4. Documentation 

* Page Title: 
* Page Description (include a mockup or hand drawn image of the page): 
* Parameters needed for the page: 
* Data needed to render the page: 
* Link destinations for the page: 
* List of tests for verifying the rendering of the page: 

### #5. Stock Articles

* Page Title: Stock Articles
* Page Description (include a mockup or hand drawn image of the page): This page displays recent news articles and SEC filings related to a specific stock.
![Stock Articles page](https://github.com/user-attachments/assets/39ef078b-23fd-4a87-87ba-836883ce43ca)
* Parameters needed for the page: List of news articles including: article title, date, and description for each article. List of SEC Filings including: filing date, form number, and description for each filing.
* Data needed to render the page: article name, article date, article description, filing date, filing form number, filing desciption
* Link destinations for the page: Clicking on a new article box opens the news article in a new tab. Clicking on an SEC filing row opens the filing in a new tab.
* List of tests for verifying the rendering of the page: Correctly display a static list of news articles, verify news article title is a string, verify the date is in the correct format, verify the desciption is a string. Correctly display a static list of SEC filings, verify the date is the correct format, verify the form number matches a known valid option (stored in an enum), verify the description is a string. Verify clicking aricle goes to the correct page. Verify clicking SEC filing goes to the correct page. Add an article with known data to the News section and verify the data matches what is expected. Add an row with known data to the SEC Filing table and verify the data matches what is expected. 
