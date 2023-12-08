// DOM elements
const quoteText = document.querySelector(".quote");
const quoteBtn = document.querySelector(".buttons button");
const authorName = document.querySelector(".name");
const speechBtn = document.querySelector(".speech");
const copyBtn = document.querySelector(".copy");
const facebookBtn = document.querySelector(".facebook");
const searchBtn = document.querySelector(".search-btn");
const searchInput = document.querySelector(".search-input");
const synth = speechSynthesis;

// Function to fetch and display a random quote
function randomQuote() {
    quoteBtn.classList.add("loading");
    quoteBtn.innerText = "Loading Quote...";
    
    fetch("http://api.quotable.io/random")
    // Fetching a random quote from an API 
    //fetch("https://zenquotes.io/api/random")
        .then(response => response.json())
        .then(result => {
            quoteText.innerText = result.content;
            authorName.innerText = result.author;
            quoteBtn.classList.remove("loading");
            quoteBtn.innerText = "New Quote";
        });
}

// Event listener for the speech button
speechBtn.addEventListener("click", () => {
    if (!quoteBtn.classList.contains("loading")) {
        let utterance = new SpeechSynthesisUtterance(`${quoteText.innerText} by ${authorName.innerText}`);
        synth.speak(utterance);
        // Check if speech synthesis is active and update the button state
        setInterval(() => {
            !synth.speaking ? speechBtn.classList.remove("active") : speechBtn.classList.add("active");
        }, 10);
    }
});

// Event listener for copying the quote to the clipboard
copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(quoteText.innerText);
});

// Event listener for sharing the quote on Facebook
facebookBtn.addEventListener("click", () => {
    let facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${quoteText.innerText}`;
    window.open(facebookUrl, "_blank");
});

// Function to search for quotes by a specific author in the MongoDB database
async function searchQuoteByAuthor(author) {
    quoteBtn.classList.add("loading");
    quoteBtn.innerText = "Searching...";

    const { MongoClient } = require("mongodb");


    const mongoUri = "mongodb+srv://kunalsuroshe2905:4SmYd9tzgD5Qx1gA@cluster0.xdgfzxs.mongodb.net/QuoteGenerator";



    try {
        const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();

        const database = client.db("QuoteGenerator");
        const collection = database.collection("Quotecollection");

        const result = await collection.find({ author: author }).toArray();

        if (result.length > 0) {
            const randomIndex = Math.floor(Math.random() * result.length);
            quoteText.innerText = result[randomIndex].content;
            authorName.innerText = result[randomIndex].author;
        } else {
            quoteText.innerText = "No quotes found for the author.";
            authorName.innerText = "";
        }
    } catch (error) {
        console.error("Error fetching quotes:", error);
        quoteText.innerText = "An error occurred while fetching quotes.";
        authorName.innerText = "";
    } finally {
        const client = new MongoClient(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        quoteBtn.classList.remove("loading");
        quoteBtn.innerText = "New Quote";
        // Close the MongoDB connection
        client.close();
    }
}

// Event listener for the search button
searchBtn.addEventListener("click", () => {
    const author = searchInput.value.trim();
    if (author !== "") {
        searchQuoteByAuthor(author);
    } else {
        alert("Please enter an author name to search for quotes.");
    }
});

// Event listener for fetching and displaying a random quote
quoteBtn.addEventListener("click", randomQuote);