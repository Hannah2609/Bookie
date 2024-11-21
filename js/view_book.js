import { baseUrl, handleAPIError } from './common.js';
import { loanBook } from './loan_book.js';

const bookInfoSection = document.querySelector('#book-info');
const authorBooksSection = document.querySelector('#author-books');

let bookID = new URLSearchParams(window.location.search).get('id');

// Fetch and display the current book's details and books by the same author
const viewBook = (book) => {
    displayBookInfo(book);
    fetchBooksByAuthor(book.author);
};

// Display the current book's information
const displayBookInfo = (book) => {
    bookInfoSection.innerHTML = `
        <img src="${book.cover}" alt="${book.title}">
        <section>
            <div id="titles">
                <h1>${book.title}</h1>
                <h2>${book.author}</h2>
                <p>E-book</p>
            </div>
            <div id="released">
                <p>Released: ${book.publishing_year}</p>
            </div>
            <div id="published_by">
                <p>Published by: ${book.publishing_company}</p>
            </div>
            <button id="loan-btn">Loan Book</button>
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
    authorBooksSection.innerHTML = books.length > 0 ? `
        <h3>More Books by ${books[0].author}</h3>
        <div class="book-cards">
            ${books.map(book => `
                <div class="book-card">
                    <h4>${book.title}</h4>
                    <p>${book.publishing_year}</p>
                    <a href="view_book.html?id=${book.book_id}" class="view-book-btn">View Details</a>
                </div>
            `).join('')}
        </div>
    ` : `<p>No other books found by this author.</p>`;
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
