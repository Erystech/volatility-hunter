// app.js

// 1. The API URL (Top 100 coins, USD, sorted by market cap)
const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

let allCoins = [];

// 2. The Fetch Function
async function init() {
    console.log("🚀 Starting Volatility Hunter...");
    
    try {
        // Fetch data from the server
        const response = await fetch(API_URL);
        
        // Convert to JSON
        allCoins = await response.json();
        

        console.log("✅ Data saved to memory");

        processVolatility(allCoins);

        
    } catch (error) {
        console.error("❌ Error:", error);
        const outputElement = document.getElementById('output');
        if (outputElement) {
            outputElement.textContent = "Error loading data. Check console for details.";
            outputElement.classList.add("text-red-600");
        }
    }
}


init();






function processVolatility(data) {
    const sortedData = [...data];

    sortedData.sort((a, b) => {
        return b.price_change_percentage_24h - a.price_change_percentage_24h;
    });

    const topGainers = sortedData.slice(0, 5);
    renderHero(topGainers[0]);
    const topLosers = sortedData.slice(-5).reverse();

    console.log("🔥 Top Gainers:", topGainers);
    console.log("📉 Top Losers:", topLosers);


    const gainersContainer = document.getElementById('gainers-list');
    const losersContainer = document.getElementById('losers-list');

    if (gainersContainer) {
        gainersContainer.innerHTML = topGainers.map(coin => createCoinCard(coin)).join('');
    }

    if (losersContainer) {
        losersContainer.innerHTML = topLosers.map(coin => createCoinCard(coin)).join('');
    }

    return{topGainers, topLosers};
}





function createCoinCard (coin) {
    const isPositive = coin.price_change_percentage_24h >= 0;
    
    const trendColor = isPositive ? 'text-emerald-500' : 'text-rose-500'

    const arrow = isPositive ? '▲' : '▼';
    return `
        <div class="flex justify-between items-center border-b border-gray-100 py-4 last:border-0 hover:bg-gray-50 transition p-2 rounded-lg cursor-pointer">
            <div class="flex items-center gap-4">
                <img src="${coin.image}" alt="${coin.name}" class="w-8 h-8 rounded-full">
                <div>
                    <h3 class="font-bold text-gray-900 text-sm">${coin.name}</h3>
                    <span class="text-xs text-gray-500 uppercase">${coin.symbol}</span>
                </div>
            </div>

            <div class="text-right">
                <p class="font-bold text-gray-900 text-sm">$${coin.current_price.toLocaleString()}</p>
                <p class="text-xs font-bold ${trendColor}">
                    ${coin.price_change_percentage_24h.toFixed(2)}%
                </p>
            </div>
        </div>
    `;
}

function renderHero(coin) {
    const heroContainer = document.getElementById('hero');

    if (!heroContainer || !coin) return;

    const isPositive = coin.price_change_percentage_24h >= 0;
    const trendColor = isPositive ? 'text-emerald-500' : 'text-rose-500';

    heroContainer.innerHTML = `
            <div class="flex flex-col md:flex-row justify-between items-center gap-6">
            
            <div class="flex items-center gap-6">
                <img src="${coin.image}" alt="${coin.name}" class="w-24 h-24 rounded-full shadow-md">
                <div>
                    <div class="inline-block px-3 py-1 mb-2 text-xs font-bold text-orange-500 bg-orange-50 rounded-full">
                        🔥 Top Gainer
                    </div>
                    <h2 class="text-4xl font-bold text-gray-900">${coin.name}</h2>
                    <p class="text-xl text-gray-400 uppercase tracking-wide">${coin.symbol}</p>
                </div>
            </div>

            <div class="text-center md:text-right">
                <p class="text-5xl font-extrabold text-gray-900 tracking-tight">
                    $${coin.current_price.toLocaleString()}
                </p>
                <p class="text-xl font-bold ${trendColor} mt-2">
                    ${isPositive ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}% (24h)
                </p>
            </div>
        </div>
    `;
}


const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', (e) => {

        const searchTerm = e.target.value.toLowerCase();
        
        const filteredCoins = allCoins.filter(coin =>{
            return coin.name.toLowerCase().includes(searchTerm)  ||
                coin.symbol.toLowerCase().includes(searchTerm);
        });

        processVolatility(filteredCoins);
})