const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote');
const addQuoteBtn = document.getElementById('add-quote');
const syncBtn = document.getElementById('sync');
const notification = document.getElementById('notification');

let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "Life is what happens when you’re busy making other plans.", author: "John Lennon" },
    { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" }
];

// ✅ Function: Fetch quotes from server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        const data = await response.json();
        return data.map(item => ({
            text: item.title,
            author: "Server Author"
        }));
    } catch (error) {
        console.error("Failed to fetch from server:", error);
        return [];
    }
}

// ✅ Function: Post quote to server (mock)
async function postQuoteToServer(quote) {
    try {
        await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quote)
        });
    } catch (error) {
        console.error("Failed to post to server:", error);
    }
}

// ✅ Function: Sync local quotes with server
async function syncQuotes() {
    showNotification("🔄 Syncing quotes with server...");

    const serverQuotes = await fetchQuotesFromServer();

    if (serverQuotes.length > 0) {
        const mergedQuotes = resolveConflicts(quotes, serverQuotes);
        quotes = mergedQuotes;
        localStorage.setItem('quotes', JSON.stringify(quotes));
        showNotification("✅ Quotes synced successfully!");
    } else {
        showNotification("⚠️ Failed to fetch from server!");
    }
}

// ✅ Function: Conflict resolution (server takes precedence)
function resolveConflicts(localQuotes, serverQuotes) {
    const localTexts = new Set(localQuotes.map(q => q.text));
    const newServerQuotes = serverQuotes.filter(q => !localTexts.has(q.text));
    return [...localQuotes, ...newServerQuotes];
}

// ✅ Function: Show a random quote
function showRandomQuote() {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = `"${random.text}"`;
    quoteAuthor.textContent = `– ${random.author}`;
}

// ✅ Function: Add a new quote manually
function addQuote() {
    const text = prompt("Enter the quote:");
    const author = prompt("Enter the author:");

    if (text && author) {
        const newQuote = { text, author };
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        postQuoteToServer(newQuote);
        showNotification("📝 Quote added and synced!");
    } else {
        showNotification("⚠️ Quote or author missing!");
    }
}

// ✅ Function: Show notification
function showNotification(message) {
    notification.textContent = message;
    notification.classList.remove('hidden');
    setTimeout(() => notification.classList.add('hidden'), 3000);
}

// ✅ Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
syncBtn.addEventListener('click', syncQuotes);

// ✅ Periodically fetch updates
setInterval(syncQuotes, 15000);

// Initial display
showRandomQuote();
