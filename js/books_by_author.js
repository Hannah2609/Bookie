import { baseUrl, handleAPIError } from './common.js';

const booksContainer = document.querySelector('#books_by_author');
const authorTitle = document.querySelector('#title_author'); 
const authorID = new URLSearchParams(window.location.search).get('id');

// Function to display book as a card
const renderBook = (book) => {
    const bookCard = document.createElement('article');
    bookCard.innerHTML = `
    <a href="view_book.html?id=${book.book_id}" aria-label="Read more about this book">
            <div class="book-img">
                <img src="img/placeholder.png" alt="${book.title}">   
            </div>
            <div class="book-text">
                <h3>${book.title}</h3>
                <p>${book.author}</p>
            </div>  
        </a>
    `;
    booksContainer.appendChild(bookCard);
};

// Function to show books by a specific author
const fetchBooksByAuthor = (authorID) => {
    // Get author info
    fetch(`${baseUrl}/authors`)
        .then(handleAPIError)
        .then(authors => {
            // Find author based on their ID
            const author = authors.find(a => a.author_id === parseInt(authorID));
            if (!author) throw new Error('Author not found');
            
            authorTitle.textContent = `Books by ${author.author_name}`;
            
            // Get books by author
            return fetch(`${baseUrl}/books?a=${authorID}`);
        })
        .then(handleAPIError)
        .then(books => {
            if (books.length > 0) {
                books.forEach(renderBook); 
            } else {
                booksContainer.innerHTML = `<p>No books found for this author.</p>`;
            }
        })
        .catch((error) => {
            booksContainer.innerHTML = `
                <h3>Error</h3>
                <p>Could not fetch books by this author.</p>
                <p class="error">${error}</p>
            `;
        });
};

// Check if authorID exist and display books
if (authorID) {
    fetchBooksByAuthor(authorID);
} else {
    authorTitle.textContent = "Error";
    booksContainer.innerHTML = `<p>Author ID is missing in the URL.</p>`;
}
