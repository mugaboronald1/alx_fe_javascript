// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const newQuoteText = document.getElementById('newQuoteText');
const newQuoteCategory = document.getElementById('newQuoteCategory');
const addQuoteBtn = document.getElementById('addQuoteBtn');
const exportQuotesBtn = document.getElementById('exportQuotesBtn');
const importFile = document.getElementById('importFile');

// Load quotes from Local Storage or initialize default quotes
let quotes = JSON.parse(localStorage.getItem('quotes') || '[]');
if (quotes.length === 0) {
    quotes = [
        { text: "The best way to predict the future is to create it.", category: "Motivation" },
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "Do what you can, with what you have, where you are.", category: "Motivation" },
    ];
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Save quotes array to Local Storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available. Add one!";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
    sessionStorage.setItem('lastQuote', JSON.stringify(quote)); // Store last viewed quote in session
}

// Add a new quote
function addQuote() {
    const text = newQuoteText.value.trim();
    const category = newQuoteCategory.value.trim();

    if (text === "" || category === "") {
        alert("Please enter both quote and category.");
        return;
    }

    quotes.push({ text, category });
    saveQuotes();

    newQuoteText.value = '';
    newQuoteCategory.value = '';
    alert("Quote added successfully!");
}

// Export quotes as JSON file
function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid JSON file format.');
            }
        } catch (err) {
            alert('Error parsing JSON file.');
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Event listeners
newQuoteBtn.addEventListener('click', showRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);
exportQuotesBtn.addEventListener('click', exportQuotes);
importFile.addEventListener('change', importFromJsonFile);

// Optionally show last viewed quote from session storage
window.addEventListener('load', () => {
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
        quoteDisplay.textContent = `"${lastQuote.text}" — ${lastQuote.category}`;
    }
});
