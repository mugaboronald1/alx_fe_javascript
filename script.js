// Array to store quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Success usually comes to those who are too busy to be looking for it.", category: "Motivation" },
    { text: "Happiness is not something ready made. It comes from your own actions.", category: "Life" }
];

// References to DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Create category dropdown
const categoryFilter = document.createElement("select");
categoryFilter.id = "categoryFilter";
document.body.insertBefore(categoryFilter, quoteDisplay);

// Load saved quotes and selected category from localStorage
function loadQuotes() {
    const storedQuotes = JSON.parse(localStorage.getItem("quotes") || "[]");
    if (storedQuotes.length > 0) quotes = storedQuotes;

    populateCategories();

    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory && [...categoryFilter.options].some(opt => opt.value === savedCategory)) {
        categoryFilter.value = savedCategory;
    }

    showRandomQuote();
}

// Save quotes array to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
    const filteredQuotes = filterQuote();
    if (filteredQuotes.length === 0) {
        quoteDisplay.textContent = "No quotes in this category.";
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    quoteDisplay.textContent = filteredQuotes[randomIndex].text;
}

// Add a new quote
function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");
    const text = textInput.value.trim();
    const category = categoryInput.value.trim();

    if (!text || !category) {
        alert("Please enter both quote text and category.");
        return;
    }

    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    textInput.value = "";
    categoryInput.value = "";
    showRandomQuote();
}

// Populate dropdown with unique categories
function populateCategories() {
    const uniqueCategories = [...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = "";

    const allOption = document.createElement("option");
    allOption.value = "All";
    allOption.textContent = "All";
    categoryFilter.appendChild(allOption);

    uniqueCategories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });

    // Restore selected category
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory && [...categoryFilter.options].some(opt => opt.value === savedCategory)) {
        categoryFilter.value = savedCategory;
    }
}

// Filter quotes based on selected category
function filterQuote() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);

    if (selectedCategory === "All") return quotes;
    return quotes.filter(q => q.category === selectedCategory);
}

// Event listeners
newQuoteBtn.addEventListener("click", showRandomQuote);
categoryFilter.addEventListener("change", showRandomQuote);
document.addEventListener("DOMContentLoaded", loadQuotes);
