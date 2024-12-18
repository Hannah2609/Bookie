import { baseUrl, handleAPIError } from './common.js';
import { loanBook } from './loan_book.js';
import { fetchLoanHistory, displayLoanHistory } from './loan_history.js';

const bookInfoSection = document.querySelector('#book-info');
const authorBooksSection = document.querySelector('#author-books');
const loanHistorySection = document.querySelector("#loan-history");

let bookID = new URLSearchParams(window.location.search).get('id');

// Fetch and display the current book's details and books by the same author
const viewBook = (book) => {
    displayBookInfo(book);
    fetchBooksByAuthor(book.author);

        // Check if user is admin and fetch loan history
        const userID = sessionStorage.getItem("user_id");
        if (userID === "2679") { // Check if the user is admin
            loanHistorySection.classList.remove("hidden");
            fetchLoanHistory(bookID)
                .then(loans => displayLoanHistory(loans))
                .catch(error => {
                    loanHistorySection.innerHTML = `
                        <h3>Error</h3>
                        <p>Could not fetch loan history.</p>
                        <p class="error">${error.message}</p>
                    `;
                });
        } else {
            loanHistorySection.classList.add("hidden");
        }
};

// Display the current book's information
const displayBookInfo = (book) => {

 // checks if book.cover is an empty string and show placeholder instead
const coverImage = book.cover && book.cover.trim() !== "" ? book.cover : "img/placeholder.webp";

    bookInfoSection.innerHTML = `
        <div class="book-img">
        <img src="${coverImage}" alt="${book.title}">
        </div>
        <section>
            <div id="titles">
                <h1>${book.title}</h1>
                <h2>${book.author}</h2>
                <p>E-book</p>
            </div>
            <div id="publishing-info">
                    <p>Released: ${book.publishing_year}</p>


                    <p>Published by: ${book.publishing_company}</p>

            </div>
            <button id="loan-btn" class="filled-btn">Loan Book</button>
        </section>
    `;

    document.querySelector('#loan-btn').addEventListener('click', () => {
        // Check if the user is logged in
        const userID = sessionStorage.getItem("user_id");

        if (!userID) {
            alert("You must be logged in to loan a book.");
            return;
        }
    
        loanBook(bookID, book.title, book.author); 
    });
};

// Fetch books by the same author
const fetchBooksByAuthor = (authorName) => {
    fetch(`${baseUrl}/authors`)
        .then(handleAPIError)
        .then(authors => {
            const author = authors.find(a => a.author_name.toLowerCase() === authorName.toLowerCase());
            if (!author) throw new Error('Author not found');
            return fetch(`${baseUrl}/books?a=${author.author_id}`);
        })
        .then(handleAPIError)
        .then(books => {
            const booksByAuthor = books.slice(0, 5);
            displayAuthorBooks(booksByAuthor);
        })
        .catch((error) => {
            authorBooksSection.innerHTML = `
                <h3>Error</h3>
                <p>Could not fetch books by this author.</p>
                <p class="error">${error}</p>
            `;
        });
};

// Display books by the same author in the DOM
const displayAuthorBooks = (books) => {

    // Convert bookID to number for comparison
    const currentBookId = parseInt(bookID);
    const otherBooks = books.filter(book => book.book_id !== currentBookId);

    authorBooksSection.innerHTML = otherBooks.length > 0 ? `
        <h3 class="other-books-header">Other Books by ${books[0].author}</h3>
        <div id="book-cards">
            ${otherBooks.map(book => `
        <article>
            <a href="view_book.html?id=${book.book_id}" aria-label="Read more about this book">
            <div class="book-img">
                <img src="img/placeholder.webp" alt="${book.title}">   
            </div>
            <div class="book-text">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
            </div>  
        </a>
        </article>
            `).join('')}
        </div>
        
    ` :  
        `<h3 class="other-books-header">Other Books by ${books[0].author}</h3> 
        <div id="book-cards">
        <p>No other books found by this author.</p>
        </div>
        `;
};

// Fetch the current book details
fetch(`${baseUrl}/books/${bookID}`)
    .then(handleAPIError)
    .then(viewBook)
    .catch((error) => {
        bookInfoSection.innerHTML = `
            <h3>Error</h3>
            <p>Sorry, there was an error loading the book data.</p>
            <p class="error">${error}</p>
        `;
    });
