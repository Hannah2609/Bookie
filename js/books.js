import { baseUrl, handleAPIError } from './common.js';

const NUM_BOOKS_TO_SHOW = 10; // Number of books to load at a time
const booksContainer = document.querySelector('#books');
const showMoreButton = document.querySelector('#show-more');

// Function to render a single book
const renderBook = (book) => {
    const bookCard = document.createElement('article');
    bookCard.innerHTML = `
        <a href="view_book.html?id=${book.book_id}" aria-label="Read more about this book">
            <img src="img/book.webp" alt="${book.title}">
        </a>
        <div>
            <h3><a href="view_book.html?id=${book.book_id}" aria-label="Read more about this book">${book.title}</a></h3>
            <p>${book.author}</p>
        </div>
    `;
    booksContainer.appendChild(bookCard);
};

// Function to fetch books
const fetchBooks = () => {
    fetch(`${baseUrl}/books?n=${NUM_BOOKS_TO_SHOW}`)  // Fetch random books
        .then(handleAPIError)
        .then(data => {
            // Render each book received in the response directly
            data.forEach(renderBook); // `data` is an array of books
        })
        .catch(error => {
            booksContainer.innerHTML = `
                <h3>Error</h3>
                <p>There was an error fetching books.</p>
                <p class="error">${error.message}</p>
            `;
        });
};

// Initial load of books
fetchBooks();

// Event listener for the "Show More" button
showMoreButton.addEventListener('click', fetchBooks);
