
// --- Dynamic Quote Generator with Category Filter, Web Storage & Server Sync ---

const localStorageKey = "quotesData";
const categoryStorageKey = "lastCategory";
const apiURL = "https://jsonplaceholder.typicode.com/posts"; // mock API endpoint

const quoteContainer = document.getElementById("quoteContainer");
const categoryFilter = document.getElementById("categoryFilter");
const statusMessage = document.getElementById("statusMessage");

// --- Initialize with sample quotes ---
if (!localStorage.getItem(localStorageKey)) {
  const sampleQuotes = [
    { id: 1, text: "Believe you can and you're halfway there.", category: "Motivation" },
    { id: 2, text: "The future belongs to those who prepare for it today.", category: "Inspiration" },
    { id: 3, text: "Do what you can with what you have.", category: "Motivation" },
    { id: 4, text: "Knowledge is power.", category: "Education" }
  ];
  localStorage.setItem(localStorageKey, JSON.stringify(sampleQuotes));
}

// --- Helper: get quotes from local storage ---
function getLocalQuotes() {
  return JSON.parse(localStorage.getItem(localStorageKey)) || [];
}

// --- Display a quote ---
function showRandomQuote() {
  const quotes = getLocalQuotes();
  const selectedCategory = categoryFilter.value;
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length === 0) {
    quoteContainer.innerHTML = "<p>No quotes available for this category.</p>";
    return;
  }

  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteContainer.innerHTML = `<p>"${randomQuote.text}"</p><h4>- ${randomQuote.category}</h4>`;
}

// --- Populate categories dynamically ---
function populateCategories() {
  const quotes = getLocalQuotes();
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  // Clear existing options except "All"
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  uniqueCategories.map(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category
  const lastCategory = localStorage.getItem(categoryStorageKey) || "all";
  categoryFilter.value = lastCategory;
}

// --- Filter quotes based on category ---
function filterQuotes() {
  localStorage.setItem(categoryStorageKey, categoryFilter.value);
  showRandomQuote();
}

// --- Add a new quote ---
function addQuote(text, category) {
  const quotes = getLocalQuotes();
  const newQuote = {
    id: quotes.length ? quotes[quotes.length - 1].id + 1 : 1,
    text,
    category
  };
  quotes.push(newQuote);
  localStorage.setItem(localStorageKey, JSON.stringify(quotes));
  populateCategories();
  showRandomQuote();
  postQuoteToServer(newQuote); // sync with server
}

// --- Step 1: Fetch quotes from server ---
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    return data.slice(0, 5).map(item => ({
      id: item.id,
      text: item.title,
      category: "Server"
    }));
  } catch (error) {
    console.error("Error fetching server quotes:", error);
    statusMessage.textContent = "⚠️ Server fetch failed!";
    return [];
  }
}

// --- Step 2: Post new quote to server ---
async function postQuoteToServer(quote) {
  try {
    await fetch(apiURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
  } catch (error) {
    console.error("Error posting to server:", error);
  }
}

// --- Step 3: Sync quotes with server & resolve conflicts ---
async function syncQuotes() {
  statusMessage.textContent = "🔄 Syncing with server...";
  const localQuotes = getLocalQuotes();
  const serverQuotes = await fetchQuotesFromServer();

  // Conflict resolution: server overrides duplicates
  const merged = [
    ...serverQuotes,
    ...localQuotes.filter(lq => !serverQuotes.find(sq => sq.id === lq.id))
  ];

  localStorage.setItem(localStorageKey, JSON.stringify(merged));
  populateCategories();
  showRandomQuote();
  statusMessage.textContent = "✅ Synced successfully!";
  setTimeout(() => (statusMessage.textContent = ""), 3000);
}

// --- Periodic sync every 30s ---
setInterval(syncQuotes, 30000);

// --- Event Listeners ---
document.getElementById("newQuoteBtn").addEventListener("click", showRandomQuote);
document.getElementById("syncBtn").addEventListener("click", syncQuotes);
categoryFilter.addEventListener("change", filterQuotes);

// --- Initial load ---
populateCategories();
showRandomQuote();
