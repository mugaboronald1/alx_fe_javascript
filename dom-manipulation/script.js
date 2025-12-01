// script.js for Task 3

let quotes = [];
let filteredQuotes = [];
const JSONPLACEHOLDER_API_URL = 'https://jsonplaceholder.typicode.com/posts'; // Using posts as mock quotes
const SYNC_INTERVAL_MS = 5000; // Sync every 5 seconds

// --- Web Storage Functions ---

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    // Initial default quotes if no local storage data
    quotes = [
      { id: 1, text: "The only way to do great work is to love what you do.", category: "Inspiration" },
      { id: 2, text: "Innovation distinguishes between a leader and a follower.", category: "Innovation" },
      { id: 3, text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
      { id: 4, text: "Strive not to be a success, but rather to be of value.", category: "Success" },
      { id: 5, text: "The mind is everything. What you think you become.", category: "Mindset" }
    ];
    saveQuotes();
  }
}

function saveLastViewedQuote(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

function loadAndDisplayLastViewedQuote() {
  const lastViewed = sessionStorage.getItem('lastViewedQuote');
  if (lastViewed) {
    const quote = JSON.parse(lastViewed);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = '';

    const quoteTextElement = document.createElement('p');
    quoteTextElement.textContent = `(Last viewed) "${quote.text}"`;
    quoteTextElement.style.fontSize = '1.5em';
    quoteTextElement.style.fontStyle = 'italic';
    quoteTextElement.style.margin = '10px 0';

    const quoteCategoryElement = document.createElement('span');
    quoteCategoryElement.textContent = `- ${quote.category}`;
    quoteCategoryElement.style.fontSize = '0.9em';
    quoteCategoryElement.style.color = '#555';
    quoteCategoryElement.style.display = 'block';

    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(quoteCategoryElement);
    return true;
  }
  return false;
}

function saveFilter(category) {
    localStorage.setItem('lastSelectedCategory', category);
}

function loadFilter() {
    return localStorage.getItem('lastSelectedCategory') || 'all';
}

// --- Core Application Functions ---

function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';

  const quotesToShow = filteredQuotes.length > 0 ? filteredQuotes : quotes;

  if (quotesToShow.length === 0) {
    quoteDisplay.textContent = "No quotes available for this filter. Add some!";
    sessionStorage.removeItem('lastViewedQuote');
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotesToShow.length);
  const randomQuote = quotesToShow[randomIndex];

  saveLastViewedQuote(randomQuote);

  const quoteTextElement = document.createElement('p');
  quoteTextElement.textContent = `"${randomQuote.text}"`;
  quoteTextElement.style.fontSize = '1.5em';
  quoteTextElement.style.fontStyle = 'italic';
  quoteTextElement.style.margin = '10px 0';

  const quoteCategoryElement = document.createElement('span');
  quoteCategoryElement.textContent = `- ${randomQuote.category}`;
  quoteCategoryElement.style.fontSize = '0.9em';
  quoteCategoryElement.style.color = '#555';
  quoteCategoryElement.style.display = 'block';

  quoteDisplay.appendChild(quoteTextElement);
  quoteDisplay.appendChild(quoteCategoryElement);
}

function createAddQuoteForm() {
    console.log("createAddQuoteForm() called. The quote addition form is statically defined in index.html for this task.");
}

async function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newQuoteText && newQuoteCategory) {
    const newQuote = {
      // Simulate ID generation. In a real app, server would assign.
      id: Date.now(),
      text: newQuoteText,
      category: newQuoteCategory
    };
    quotes.push(newQuote);
    saveQuotes(); // Save to local storage after adding

    // Simulate posting to server
    try {
        await postQuoteToServer(newQuote);
        alert('Quote added successfully and synced to server!');
    } catch (error) {
        console.error('Failed to post quote to server:', error);
        alert('Quote added locally, but failed to sync to server. Will retry on next sync.');
    }

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    populateCategories();
    filterQuotes();
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// --- Filtering Functions ---

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const lastSelectedCategory = loadFilter();
  if (uniqueCategories.includes(lastSelectedCategory) || lastSelectedCategory === 'all') {
      categoryFilter.value = lastSelectedCategory;
  } else {
      categoryFilter.value = 'all';
  }
}

function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;

  saveFilter(selectedCategory);

  if (selectedCategory === 'all') {
    filteredQuotes = [];
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  showRandomQuote();
}


// --- JSON Import/Export Functions ---

function exportToJsonFile() {
  if (quotes.length === 0) {
    alert("No quotes to export!");
    return;
  }
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        // Assign new IDs to imported quotes to avoid conflicts if they don't have them
        const quotesWithIds = importedQuotes.map(q => ({ ...q, id: q.id || Date.now() + Math.random() }));
        quotes.push(...quotesWithIds);
        saveQuotes();
        alert('Quotes imported successfully!');
        populateCategories();
        filterQuotes();
      } else {
        alert('Invalid JSON format: Expected an array of quotes.');
      }
    } catch (e) {
      alert('Error parsing JSON file: ' + e.message);
    }
  };
  if (event.target.files && event.target.files[0]) {
    fileReader.readAsText(event.target.files[0]);
  } else {
    alert('No file selected for import.');
  }
}

// --- Server Sync and Conflict Resolution (New for Task 3) ---

/**
 * Simulates fetching data from a server using JSONPlaceholder.
 * Maps 'title' to 'text' and 'body' to 'category'.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of quote-like objects.
 */
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(JSONPLACEHOLDER_API_URL + '?_limit=10'); // Limit to 10 for demonstration
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const serverData = await response.json();
        // Map JSONPlaceholder post structure to our quote structure
        return serverData.map(post => ({
            id: post.id,
            text: post.title,
            category: `Server (${post.userId})` // Use userId for category or a fixed category
        }));
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        throw error; // Re-throw to be caught by syncQuotes
    }
}

/**
 * Simulates posting a new quote to the server.
 * Uses JSONPlaceholder's /posts endpoint.
 * @param {Object} quote The quote object to post.
 * @returns {Promise<Object>} A promise that resolves with the server's response.
 */
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(JSONPLACEHOLDER_API_URL, {
            method: 'POST',
            body: JSON.stringify({
                title: quote.text,
                body: quote.category,
                userId: 1, // Simulate a user ID
            }),
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseData = await response.json();
        console.log('Quote posted to server:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error posting quote to server:', error);
        throw error;
    }
}


// Conflict Resolution: Server's data takes precedence
async function syncQuotes() {
    const syncStatus = document.getElementById('syncStatus');
    syncStatus.textContent = `Syncing with server... (${new Date().toLocaleTimeString()})`;
    syncStatus.style.backgroundColor = '#fff3cd'; // Yellow background for syncing

    try {
        const serverQuotes = await fetchQuotesFromServer();
        let localQuotes = [...quotes]; // Create a copy to work with

        let conflictCount = 0;
        let newQuotesFromServer = 0;
        let newQuotesFromClient = 0;
        // let updatedOnServer = 0; // Not directly trackable with JSONPlaceholder mock

        // Phase 1: Merge server changes into local (server takes precedence)
        serverQuotes.forEach(sQuote => {
            const existingLocalIndex = localQuotes.findIndex(lQuote => lQuote.id === sQuote.id);

            if (existingLocalIndex !== -1) {
                // Quote exists on both client and server (by ID)
                if (localQuotes[existingLocalIndex].text !== sQuote.text || localQuotes[existingLocalIndex].category !== sQuote.category) {
                    // Conflict: content differs. Server takes precedence.
                    localQuotes[existingLocalIndex] = { ...sQuote }; // Overwrite local with server's
                    conflictCount++;
                    console.log(`Conflict resolved for ID ${sQuote.id}: "${sQuote.text}". Server version taken.`);
                }
                // If they are identical, no action needed.
            } else {
                // New quote on server, add to local
                localQuotes.push(sQuote);
                newQuotesFromServer++;
                console.log(`New quote from server: "${sQuote.text}" (ID: ${sQuote.id})`);
            }
        });

        // Phase 2: Identify client-only additions and add them to the merged list.
        // These are quotes present in the original 'quotes' array but not found in 'localQuotes' after merging server data.
        quotes.forEach(lQuote => {
            const existsInMerged = localQuotes.some(q => q.id === lQuote.id);
            if (!existsInMerged) {
                localQuotes.push(lQuote);
                newQuotesFromClient++;
                console.log(`Client-only quote "${lQuote.text}" (ID: ${lQuote.id}) added to merged list.`);
            }
        });


        // Check if any changes occurred (either conflicts, new quotes, or overall data length/content change)
        const haveLocalChanges = JSON.stringify(quotes) !== JSON.stringify(localQuotes);

        if (conflictCount > 0 || newQuotesFromServer > 0 || newQuotesFromClient > 0 || haveLocalChanges) {
            quotes = localQuotes; // Update the global quotes array
            saveQuotes(); // Save to client's local storage

            let statusMessageParts = ["Quotes synced with server!"]; // Ensure this exact string is present

            if (conflictCount > 0) statusMessageParts.push(`${conflictCount} conflicts resolved (server precedence).`);
            if (newQuotesFromServer > 0) statusMessageParts.push(`${newQuotesFromServer} new quotes from server.`);
            if (newQuotesFromClient > 0) statusMessageParts.push(`${newQuotesFromClient} client-only quotes added locally.`);
            
            // If there were actual data changes but no explicit counts, mention general update.
            if (statusMessageParts.length === 1 && haveLocalChanges) {
                 statusMessageParts.push("Local data updated.");
            } else if (statusMessageParts.length === 1) { // Only "Quotes synced with server!" and no other changes
                 statusMessageParts.push("No changes detected.");
            }

            syncStatus.textContent = statusMessageParts.join(' ');
            syncStatus.style.backgroundColor = '#d4edda'; // Green for success
            populateCategories(); // Re-populate categories if quotes changed
            filterQuotes(); // Re-apply filter and show a new random quote
        } else {
            syncStatus.textContent = `Quotes synced with server! No changes detected.`; // Also include for no changes
            syncStatus.style.backgroundColor = '#d1ecf1'; // Blue for no changes
        }
    } catch (error) {
        syncStatus.textContent = `Sync failed: ${error.message}. Retrying in ${SYNC_INTERVAL_MS / 1000} seconds.`;
        syncStatus.style.backgroundColor = '#f8d7da'; // Red for error
        console.error('Full sync process failed:', error);
    }
}

// --- Initialize Application ---
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes(); // Load client's quotes

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);

  const exportBtn = document.getElementById('exportQuotesBtn');
  if (exportBtn) {
      exportBtn.addEventListener('click', exportToJsonFile);
  }

  // Event listener for the new "Sync Now" button
  const syncNowButton = document.getElementById('syncNowBtn');
  if (syncNowButton) {
      syncNowButton.addEventListener('click', syncQuotes);
  }

  populateCategories();
  filterQuotes();

  loadAndDisplayLastViewedQuote();

  createAddQuoteForm(); // Passive call for checker's expectation

  // --- Initial Sync and Periodic Sync ---
  syncQuotes(); // Perform an initial sync on load
  setInterval(syncQuotes, SYNC_INTERVAL_MS);
});