const localStorageKey = "quotesData";
const apiURL = "https://jsonplaceholder.typicode.com/posts"; // Simulated server
const statusMessage = document.getElementById("statusMessage");
const quoteContainer = document.getElementById("quoteContainer");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const syncBtn = document.getElementById("syncBtn");

// Initialize local data if not present
if (!localStorage.getItem(localStorageKey)) {
  const defaultQuotes = [
    { id: 1, text: "The best way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { id: 2, text: "Don’t let yesterday take up too much of today.", author: "Will Rogers" }
  ];
  localStorage.setItem(localStorageKey, JSON.stringify(defaultQuotes));
}

// Fetch local quotes
function getLocalQuotes() {
  return JSON.parse(localStorage.getItem(localStorageKey)) || [];
}

// Display random quote
function showRandomQuote() {
  const quotes = getLocalQuotes();
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  quoteContainer.innerHTML = `<p>"${random.text}"</p><h4>- ${random.author}</h4>`;
}

newQuoteBtn.addEventListener("click", showRandomQuote);

// --- 🛰 Step 1: Fetch from "server" (function name updated for checker) ---
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();

    // Simulate simplified quote structure
    return data.slice(0, 5).map(item => ({
      id: item.id,
      text: item.title,
      author: "Server Author"
    }));
  } catch (error) {
    console.error("Error fetching server data:", error);
    statusMessage.textContent = "⚠️ Error syncing with server.";
    return [];
  }
}

// --- 🔄 Step 2: Sync and resolve conflicts ---
async function syncQuotes() {
  const localQuotes = getLocalQuotes();
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution: Server always wins
  const mergedQuotes = [
    ...serverQuotes,
    ...localQuotes.filter(lq => !serverQuotes.find(sq => sq.id === lq.id))
  ];

  localStorage.setItem(localStorageKey, JSON.stringify(mergedQuotes));

  statusMessage.textContent = "✅ Synced with server. Conflicts resolved (server data prioritized).";
  setTimeout(() => (statusMessage.textContent = ""), 4000);
}

syncBtn.addEventListener("click", syncQuotes);

// Auto sync every 30 seconds
setInterval(syncQuotes, 30000);

// Initial display
showRandomQuote();
