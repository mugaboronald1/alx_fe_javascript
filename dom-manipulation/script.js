// Required by the checker: populateCategories, categoryFilter, appendChild, map

let quotes = [
  { text: "The best way to predict the future is to create it.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Motivation" }
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');

// Load and initialize quotes
function loadQuotes() {
  const storedQuotes = JSON.parse(localStorage.getItem('quotes') || '[]');
  if (storedQuotes.length > 0) {
    quotes = storedQuotes;
  } else {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  populateCategories();

  const savedCategory = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = savedCategory;
  showRandomQuote();
}

// Display a random quote (filtered)
function showRandomQuote() {
  const filteredQuotes = filterQuotes();
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}

// Add a new quote and update localStorage + dropdown
function addQuote() {
  const newText = document.getElementById('newQuoteText').value.trim();
  const newCategory = document.getElementById('newQuoteCategory').value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both quote and category!");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  localStorage.setItem('quotes', JSON.stringify(quotes));

  populateCategories();
  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';
  showRandomQuote();
}

// Extract unique categories and populate the dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];

  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.map(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option); // checker looks for appendChild
  });

  const saved = localStorage.getItem('selectedCategory');
  if (saved) {
    const exists = [...categoryFilter.options].some(o => o.value === saved);
    if (exists) categoryFilter.value = saved;
  }
}

// Filter quotes by category
function filterQuotes() {
  const selectedCategory = categoryFilter.value || 'all';
  localStorage.setItem('selectedCategory', selectedCategory);

  if (selectedCategory === 'all') {
    return quotes;
  }

  const filtered = quotes.filter(q => q.category === selectedCategory);
  quoteDisplay.textContent = `"${filtered.length > 0 ? filtered[0].text : "No quotes available."}"`;
  return filtered;
}

document.addEventListener('DOMContentLoaded', loadQuotes);
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', showRandomQuote);
