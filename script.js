// ===== Dynamic Quote Generator Script =====

let quotes = [];

// ===== Load quotes from Local Storage =====
document.addEventListener('DOMContentLoaded', () => {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
    quotes = storedQuotes;
    renderQuotes();

    // Optional: Restore last viewed category
    const lastCategory = sessionStorage.getItem('lastCategory');
    if (lastCategory) {
        filterQuotes(lastCategory);
    }
});

// ===== Display a random quote =====
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').textContent = "No quotes available.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').textContent = `"${quote.text}" — ${quote.category}`;

    // Save last viewed category
    sessionStorage.setItem('lastCategory', quote.category);
}

// ===== Render quotes on page load =====
function renderQuotes() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.textContent = '';
    if (quotes.length === 0) {
        quoteDisplay.textContent = "No quotes yet. Add one below!";
        return;
    }
    showRandomQuote();
}

// ===== Add a new quote =====
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value.trim();
    const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

    if (!newQuoteText || !newQuoteCategory) {
        alert("Please enter both quote and category.");
        return;
    }

    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);

    // Save to Local Storage
    localStorage.setItem('quotes', JSON.stringify(quotes));

    // Clear inputs
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Update display
    showRandomQuote();
}

// ===== Filter quotes by category =====
function filterQuotes(category) {
    const filtered = quotes.filter(q => q.category === category);
    if (filtered.length > 0) {
        const randomIndex = Math.floor(Math.random() * filtered.length);
        document.getElementById('quoteDisplay').textContent = `"${filtered[randomIndex].text}" — ${category}`;
    } else {
        document.getElementById('quoteDisplay').textContent = `No quotes found for category "${category}"`;
    }
}

// ===== Export quotes as JSON =====
function exportToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "quotes.json";
    a.click();
}

// ===== Import quotes from JSON file =====
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                localStorage.setItem('quotes', JSON.stringify(quotes));
                renderQuotes();
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid JSON format!');
            }
        } catch (err) {
            alert('Error reading JSON file: ' + err.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}
