// DOM elements
const quoteContainer = document.getElementById("quoteContainer");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// Load existing quotes from localStorage
let localQuotes = JSON.parse(localStorage.getItem("quotes")) || [];

// 🧠 Step 1: Fetch quotes from a mock server (simulation)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    // Simulate quotes with category and text
    return data.slice(0, 5).map(item => ({
      id: item.id,
      text: item.title,
      category: ["Motivation", "Life", "Success", "Inspiration"][item.id % 4]
    }));
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
    return [];
  }
}

// 🧠 Step 2: Simulate posting quotes to the server
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    console.log("Quote posted to server:", quote);
  } catch (error) {
    console.error("Error posting quote to server:", error);
  }
}

// 🧠 Step 3: Populate the category dropdown
function populateCategories() {
  const categories = [...new Set(localQuotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// 🧠 Step 4: Display quotes in the DOM
function displayQuotes(quotes) {
  quoteContainer.innerHTML = "";
  quotes.forEach(q => {
    const div = document.createElement("div");
    div.className = "quote-card";
    div.innerHTML = `<p>${q.text}</p><span>${q.category}</span>`;
    quoteContainer.appendChild(div);
  });
}

// 🧠 Step 5: Filter quotes by category
function filterQuotes() {
  const selected = categoryFilter.value;
  const filtered =
    selected === "all"
      ? localQuotes
      : localQuotes.filter(q => q.category === selected);

  displayQuotes(filtered);
  localStorage.setItem("selectedCategory", selected);
}

// 🧠 Step 6: Show UI notification
function showNotification(message) {
  if (!notification) return;
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => (notification.style.display = "none"), 3000);
}

// 🧠 Step 7: Sync local quotes with server + conflict resolution
async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  if (!serverQuotes.length) return;

  // Conflict resolution: server data takes precedence
  const mergedQuotes = serverQuotes;

  // Compare data for update
  if (JSON.stringify(localQuotes) !== JSON.stringify(mergedQuotes)) {
    localQuotes = mergedQuotes;
    localStorage.setItem("quotes", JSON.stringify(localQuotes));
    populateCategories();
    filterQuotes();
    showNotification("Quotes synced with server successfully!");
  }
}

// Event listeners
categoryFilter.addEventListener("change", filterQuotes);

// 🧠 Step 8: Initialize app
window.addEventListener("load", async () => {
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) categoryFilter.value = savedCategory;

  await syncQuotes(); // Sync data at startup
  populateCategories();
  filterQuotes();

  // Periodically sync every 30 seconds
  setInterval(syncQuotes, 30000);
});
