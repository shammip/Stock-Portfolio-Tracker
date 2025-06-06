////////// tracker.js uses functions from helper.js

////////// Supabase Database, https://supabase.com/docs/reference/javascript/introduction
////////// project database URL and public access key to create client
const { createClient } = supabase;
const supabaseUrl = "https://ssgnftblyikjygsmiooy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzZ25mdGJseWlranlnc21pb295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNjY3ODMsImV4cCI6MjA1NTk0Mjc4M30.gQBTPyOD_oP8BdRBdkO6Ye3vZzhpp2RTX9yYxaLXL_8";
const supabaseClient = createClient(supabaseUrl, supabaseKey);


////////////////////  bool permission for functions to run  ////////////////////
let canRun = true;

async function loadWatchlist() {

	////////////////////  from helpers.js  ////////////////////
	if (!(usernameText = findUsername())) return;
	if (!(await verifyUser(usernameText))) return;

	////////////////////  get watchlist window object  ////////////////////
	const watchlist = document.getElementById('watchlist');
	if (!watchlist) {
		console.log('Watchlist object not found');
		return;
	}

	////////////////////  remove any holdover tickers (create blank watchlist window)  ////////////////////
	const children = Array.from(watchlist.children);
	for (let i = 1; i < children.length; i++) {							//starting from index 1 (skip the title)
		children[i].removeEventListener('click', watchListSearch);
		watchlist.removeChild(children[i]);
	}

	////////////////////  get username's watchlist from database  ////////////////////
	const { data: watchlistData, error: watchlistError } = await supabaseClient
		.from('watchlists')
		.select('ticker')
		.eq('username', String(usernameText).trim());
	if (watchlistError) {
		console.log('User Watchlist Error Loading: ', watchlistError);
		return;
	}
	if (!watchlistData || watchlistData.length === 0) {
		console.log('User Watchlist Empty: ', watchlistData);
	}

	////////////////////  supabase dictionary (kinda) to array for py get_watchlist_data  ////////////////////
	const wl_list = watchlistToList(watchlistData);
	const watchlistMicroData = await get_watchlist_data(wl_list);

	for (let i = 0; i < watchlistData.length; i++) {
	////////////////////  <span> objects for details inside watchlist buttons  ////////////////////
		const sym = document.createElement("span");
		sym.innerHTML = watchlistMicroData[watchlistData[i].ticker]['ticker_symbol'];
		sym.className = "symbol";
		const cur_price = document.createElement("span");
		cur_price.innerHTML = "$" + watchlistMicroData[watchlistData[i].ticker]['cur_price'];
		cur_price.className = "price";
		const pct = document.createElement("span");
		if (watchlistMicroData[watchlistData[i].ticker]['pct_change'] >= 0) {
			pct.innerHTML = "+" + watchlistMicroData[watchlistData[i].ticker]['pct_change'] + "%";
			pct.className = "increase";
		}
		else {
			pct.className = "decrease";
			pct.innerHTML = watchlistMicroData[watchlistData[i].ticker]['pct_change'] + "%";
		}

	////////////////////  build stock's watchlist button  ////////////////////
		stockButton = document.createElement("button");
		stockButton.value = watchlistData[i].ticker;
		stockButton.append(sym);
		stockButton.append(cur_price);
		stockButton.append(pct);
		stockButton.className = "stockButton";
		stockButton.addEventListener('click', watchListSearch);
		watchlist.append(stockButton);
		}

	////////////////////  update add/remove button to watchlist  ////////////////////
	add_remove_stock_button();

	////////////////////  reset timed blocker for add/remove function  //////////////////
	startTimer();
}

function get_watchlist_data(watchlist) {
	////////////////////  call function to search yFinance for searchText  ////////////////////
	return fetch('/get_watchlist_data', {
		method: 'POST',															//POST for sending data to server (GET just for getting data)
		headers: {
			'Content-Type': 'application/json'									//telling what type of data to expect
		},
		body: JSON.stringify({ 'tickerList': watchlist })						//js (object) dictionary converted to JSON string for server handling
	})

		////////////////////  stock details listed in html   ////////////////////
		.then(response => response.json())										//JSON string converted to js object for js handling
		.then(data => { return data });											//data is js dictionary {item : details}, item is ticker symbol
		//.catch(error => console.error('Error:', error));		
}

////////////////////  supabase dictionary (kinda) to array for py get_watchlist_data  ////////////////////
function watchlistToList(watchlist) {
	wl_list = [];
	for (let i = 0; i < watchlist.length; i++) {
		ticker = watchlist[i]['ticker'];
		wl_list.push(ticker)
	}
	return wl_list;
}

async function add_remove_stock_button() {

	////////////////////  from helpers.js  ////////////////////
	if (!(usernameText = findUsername())) return;
	if (!(await verifyUser(usernameText))) return;
	if (!(tickerText = findTicker())) return;

	////////////////////  get stock display window object  ////////////////////
	const stockDisplay = document.getElementById('stockDisplay');
	if (!stockDisplay){
		console.log('Stock Diplay Window object not found');
		return;
	}

	////////////////////  remove previous add/remove buttons (screws up => sometimes multiple buttons)  ////////////////////
	const duplicateButtons = document.querySelectorAll("#watchlistButton");
	duplicateButtons.forEach(button => {
		stockDisplay.removeChild(button);
	});

	////////////////////  check if displayed stock is in user's watchlist  ////////////////////
	const { data: watchlistData, error: watchlistError } = await supabaseClient
		.from('watchlists')
		.select()
		.eq('ticker', String(tickerText).trim())
		.eq('username', String(usernameText).trim());

	////////////////////  build watchlist button  ////////////////////
	const watchlistButton = document.createElement("button");
	watchlistButton.id = "watchlistButton"
	stockDisplay.appendChild(watchlistButton);

	////////////////////  assign as "remove" button  ////////////////////
	if (watchlistData && watchlistData.length > 0) {
		watchlistButton.innerHTML = "remove from Watchlist";
		watchlistButton.className = "removeButton";
		watchlistButton.addEventListener('click', removeFromWatchlist);
	}

	////////////////////  assign as "add" button  ////////////////////
	if (watchlistError || !watchlistData || watchlistData.length === 0) {
		watchlistButton.innerHTML = "add to Watchlist";
		watchlistButton.className = "addButton";
		watchlistButton.addEventListener('click', addToWatchlist);
	}

	////////////////////  unfocus cursor from button (no accidental clicks) ////////////////////
	watchlistButton.blur();
	return;
}

async function addToWatchlist() {

	////////////////////  timed blocker to prevent double clicking mess (reset in loadWatchlist)  //////////////////
	if (!canRun) return;
	canRun = false;

	////////////////////  from helpers.js  ////////////////////
	if (!(usernameText = findUsername())) return;
	if (!(await verifyUser(usernameText))) return;
	if (!(companyNameText = findCompanyName())) return;
	if (!(tickerText = findTicker())) return;

	////////////////////  check if stock is in stock table  ////////////////////
	const { data: stockData, error: stockError } = await supabaseClient
		.from('stock')
		.select()
		.eq('ticker', String(tickerText).trim());
	if (stockData && stockData.length > 0) {
		console.log('Stock already in table: ', stockData);
	}

	////////////////////  if stock NOT in stock table, insert stock  ////////////////////
	if (stockError || !stockData || stockData.length === 0) {
		const { error: newStockInsertError } = await supabaseClient
			.from('stock')
			.insert({ ticker: String(tickerText).trim(), name: String(companyNameText).trim() });
		if (newStockInsertError) {
			console.log('New Stock Insert Error: ', newStockInsertError);
			startTimer();
			return;
		}
		////////////////////  confirm stock insert  ////////////////////
		else {
			const { data: newStockData, error: newStockError } = await supabaseClient
				.from('stock')
				.select()
				.eq('ticker', String(tickerText).trim());
			if (newStockData && newStockData.length > 0) {
				console.log('Stock added to database: ', newStockData);
			}
			else if (newStockError || !newStockData || newStockData.length === 0) {
				console.log('Stock failed to insert to stock table: ', newStockError);
				startTimer();
				return;
			}
		}
	}

	////////////////////  check if username/stock pair already in watchlist  ////////////////////
	const { data: watchlistData, error: watchlistError } = await supabaseClient
		.from('watchlists')
		.select()
		.eq('ticker', String(tickerText).trim())
		.eq('username', String(usernameText).trim());
	if (watchlistData && watchlistData.length > 0){
		console.log('Stock already in User Watchlist: ', watchlistData);
		startTimer();
		return;
	}

	////////////////////  Insert Username & Stock to Watchlist junction table  ////////////////////
	if (watchlistError || !watchlistData || watchlistData.length === 0) {
		const { error: watchlistInsertError } = await supabaseClient
			.from('watchlists')
			.insert({ username: String(usernameText).trim(), ticker: String(tickerText).trim() });
		if (watchlistInsertError) {
			console.log('Watchlist insert failed: ', watchlistInsertError);
		}

		////////////////////  Check for insert success  ////////////////////
		else {
			const { data: newWatchlistData, error: newWatchlistError } = await supabaseClient
				.from('watchlists')
				.select()
				.eq('ticker', String(tickerText).trim())
				.eq('username', String(usernameText).trim());
			if (newWatchlistData && newWatchlistData.length > 0) {
				console.log('Stock added to Watchlist', newWatchlistData);
			}
			else if (newWatchlistError || !newWatchlistData || newWatchlistData.length === 0) {
				console.log('Stock not appearing in Watchlist after insert', newWatchlistData);
			}
		}
	}

	////////////////////  refresh watchlist window  //////////////////
	loadWatchlist();
}

async function removeFromWatchlist() {

	////////////////////  timed blocker to prevent double clicking mess (resets in loadWatchlist)  //////////////////
	if (!canRun) return;
	canRun = false;

	////////////////////  from helper.js  ////////////////////
	if (!(usernameText = findUsername())) return;
	if (!(await verifyUser(usernameText))) return;
	if (!(tickerText = findTicker())) return;

	////////////////////  check if username/stock pair actually in watchlist  ////////////////////
	const { data: watchlistData, error: watchlistError } = await supabaseClient
		.from('watchlists')
		.select()
		.eq('ticker', String(tickerText).trim())
		.eq('username', String(usernameText).trim());
	if (watchlistError || !watchlistData || watchlistData.length === 0) {
		console.log('Stock not found in User Watchlist: ', watchlistError);
		startTimer();
		return;
	}

	////////////////////  delete username/stock pair from watchlist  ////////////////////
	if (watchlistData && watchlistData.length > 0) {
		const { error: watchlistDeleteError } = await supabaseClient
			.from('watchlists')
			.delete()
			.eq('ticker', String(tickerText).trim())
			.eq('username', String(usernameText).trim());
		if (watchlistDeleteError) {
			console.log('Watchlist deletion failed: ', watchlistDeleteError);
		}
		else {
			const { data: newWatchlistData, error: newWatchlistError } = await supabaseClient
				.from('watchlists')
				.select()
				.eq('ticker', String(tickerText).trim())
				.eq('username', String(usernameText).trim());
			if (newWatchlistError || !newWatchlistData || newWatchlistData.length === 0) {
				console.log('Stock has been removed from Watchlist', newWatchlistData);
			}
		}
	}

	////////////////////  refresh watchlist window  ////////////////////
	loadWatchlist();
}

async function add_news_button() {

	////////////////////  from helpers.js  ////////////////////
	if (!(tickerText = findTicker())) return;

	////////////////////  get stock display window object  ////////////////////
	const stockDisplay = document.getElementById('stockDisplay');
	if (!stockDisplay){
		console.log('Stock Diplay Window object not found');
		return;
	}

	////////////////////  remove previous news buttons (screws up => sometimes multiple buttons)  ////////////////////
	const duplicateButtons = document.querySelectorAll("#newsButton");
	duplicateButtons.forEach(button => {
		stockDisplay.removeChild(button);
	});

	////////////////////  build news button  ////////////////////
	const newsButton = document.createElement("button");
	newsButton.innerHTML = "News Articles";
	newsButton.id = "newsButton";
	newsButton.className = "news_article";
	newsButton.onclick = () => {
		location.href = `news/${tickerText}`;
	}
	stockDisplay.appendChild(newsButton);

	////////////////////  unfocus cursor from button (no accidental clicks) ////////////////////
	newsButton.blur();
	return;
}

function yFiSearch(tickerToSearch) {

	////////////////////  clear previous data   ////////////////////
	const dataWindow = document.getElementById('stockData');
	dataWindow.innerHTML = '';
	const companyTicker = document.getElementById('companyTicker');
	companyTicker.textContent = '';
	const companyName = document.getElementById('companyName');
	companyName.textContent = '';

	////////////////////  call function to search yFinance for searchText  ////////////////////
	return fetch('/get_stock_details', {
		method: 'POST',															//POST for sending data to server (GET just for getting data)
		headers: {
			'Content-Type': 'application/json'									//telling what type of data to expect
		},
		body: JSON.stringify({ 'searchText': tickerToSearch.value })				//js (object) dictionary converted to JSON string for server handling
	})
		////////////////////  stock details listed in html   ////////////////////
		.then(response => response.json())										//JSON string converted to js object for js handling
		.then(data => {															//data is js dictionary {item : details}, item is ticker symbol
			companyName.textContent = data["company_name"];
			companyTicker.textContent = data["ticker_symbol"];
			const display_order = ["cur_price", "pct_change", "day_open", "day_high", "day_low", 
				"52wk_high", "52wk_low", "market_cap", "annual_revenue"];
			display_order.forEach(key => {
				const value = data[key];
				if (key != "company_name" && key != "ticker_symbol") {
					if (key === "cur_price") { //display current price
						const cur_price_ = document.createElement('p');
						const value_rounded = Number(value).toFixed(2);
						cur_price_.textContent = `$${value_rounded}`;
						cur_price_.id = key;
						cur_price_.className = "cur_price_";
						dataWindow.appendChild(cur_price_)
					}
					if (key === "pct_change") { //display percent change
						const pct_change_num = Number(value);
						const pct_change_ = document.createElement('p');
						if (pct_change_num >= 0) {
							pct_change_.style.color = "green";
						} else {
							pct_change_.style.color = "darkred";
						}
						pct_change_.textContent = `${value}%`;
						pct_change_.id = key;
						pct_change_.className = "pct_change_";
						dataWindow.appendChild(pct_change_)
					}
					if (key === "day_high") { //display day high
						const day_high_ = document.createElement('p');
						const value_rounded = Number(value).toFixed(2);
						day_high_.textContent = `Day High: $${value_rounded}`;
						day_high_.id = key;
						day_high_.className = "day_high_";
						dataWindow.appendChild(day_high_)
					}
					if (key === "day_low") { //display day low
						const day_low_ = document.createElement('p');
						const value_rounded = Number(value).toFixed(2);
						day_low_.textContent = `Day Low: $${value_rounded}`;
						day_low_.id = key;
						day_low_.className = "day_low_";
						dataWindow.appendChild(day_low_)
					}
					if (key === "day_open") { //display day open
						const day_open_ = document.createElement('p');
						const value_rounded = Number(value).toFixed(2);
						day_open_.textContent = `Day Open: $${value_rounded}`;
						day_open_.id = key;
						day_open_.className = "day_open_";
						dataWindow.appendChild(day_open_)
					}
					if (key === "52wk_high") { //display year high
						const year_high_ = document.createElement('p');
						const value_rounded = Number(value).toFixed(2);
						year_high_.textContent = `Year High: $${value_rounded}`;
						year_high_.id = key;
						year_high_.className = "year_high_";
						dataWindow.appendChild(year_high_)
					}
					if (key === "52wk_low") { //display year low
						const year_low_ = document.createElement('p');
						const value_rounded = Number(value).toFixed(2);
						year_low_.textContent = `Year Low: $${value_rounded}`;
						year_low_.id = key;
						year_low_.className = "year_low_";
						dataWindow.appendChild(year_low_)
					}
					if (key === "market_cap") { //display market cap
						const market_cap_ = document.createElement('p');
						let value_rounded = Number(value).toFixed(2);
						if (value_rounded >= 1_000_000_000) {
							value_rounded = `${(value_rounded / 1_000_000_000).toFixed(2)}B`;
						} else if (value_rounded >= 1_000_000) {
							value_rounded = `${(value_rounded / 1_000_000).toFixed(2)}M`;
						}
						market_cap_.textContent = `Market Cap: $${value_rounded}`;
						market_cap_.id = key;
						market_cap_.className = "market_cap_";
						dataWindow.appendChild(market_cap_)
					}
					if (key === "annual_revenue") { //display annual revenue
						const annual_revenue_ = document.createElement('p');
						let value_rounded = Number(value).toFixed(2);
						if (value_rounded >= 1_000_000_000) {
							value_rounded = `${(value_rounded / 1_000_000_000).toFixed(2)}B`;
						} else if (value_rounded >= 1_000_000) {
							value_rounded = `${(value_rounded / 1_000_000).toFixed(2)}M`;
						}
						annual_revenue_.textContent = `Annual Revenue: $${value_rounded}`;
						annual_revenue_.id = key;
						annual_revenue_.className = "annual_revenue_";
						dataWindow.appendChild(annual_revenue_)
					}
				}
			})
		})
	}

	/*
	////////////////////  stock details listed in html   ////////////////////
		.then(response => response.json())										//JSON string converted to js object for js handling
		.then(data => {															//data is js dictionary {item : details}, item is ticker symbol
			Object.entries(data).forEach(([item, details]) => {
				companyTicker.textContent = details.ticker_symbol;
				companyName.textContent = details.company_name;
				Object.entries(details).forEach(([key, value]) => {				//details is nested dictionary of granular data about stock
					if (key !== "ticker_symbol" && key !== "company_name") {
						const dataLine = document.createElement('span');
						dataLine.textContent = `${key} : ${value}`;
						dataLine.id = key;
						dataLine.className = "dataLine";
						dataWindow.appendChild(dataLine);
					}
				})
			})
		})
		.catch(error => console.error('Error:', error));
		*/

////////////////////  stockDetails function separates yFiSearch and button change, gives DOM chance to update  ////////////////////
////////////////////  as opposed to button change being inside yFiSearch  ////////////////////
function stockDetails(ticker) {
	timeFunction( () => yFiSearch(ticker), "yFiSearch" ).then( () => {
		add_remove_stock_button();
		add_news_button();
	});
}

////////////////////  details search from search bar  ////////////////////
function searchBarSearch() {
	////////////////////  stop html page from reloading before rest of function can run  ////////////////////
	event.preventDefault();

	const ticker = searchBarValue();
	stockDetails(ticker);
}

////////////////////  stock details from watchlist button  ////////////////////
function watchListSearch(event) {
	////////////////////  stop html page from reloading before rest of function can run  ////////////////////
	event.preventDefault();

	const ticker = watchListButtonValue(event);
	stockDetails(ticker);
}

////////////////////  connect "Enter" to search bar  ////////////////////
function enterToSearch(pressed) {
	if (pressed.key === 'Enter') {
		searchBarSearch();
	}
}

////////////////////  assign searchBarSearch function to search button  ////////////////////
const searchButton = document.getElementById('searchButton');
searchButton.addEventListener('click', searchBarSearch);

////////////////////  assign search function to enter key only when search bar active  ////////////////////
const searchText = document.getElementById('searchText');
searchText.addEventListener('focus', () => {
	document.addEventListener('keydown', enterToSearch);
})
searchText.addEventListener('blur', () => {
	document.removeEventListener('keydown', enterToSearch);
})