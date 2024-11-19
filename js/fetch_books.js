import { baseUrl, handleAPIError } from './common.js';

// Function to load books dynamically
export const fetchBooks = (numBooks, showMoreBtnSelector = null) => {
    const booksContainer = document.querySelector("#books");
    const showMoreBtn = showMoreBtnSelector ? document.querySelector(showMoreBtnSelector) : null;

    // Function to render a single book
    const renderBook = (book) => {
        const bookCard = document.createElement('article');
        bookCard.innerHTML = `
            <a href="view_book.html?id=${book.book_id}" aria-label="Read more about this book">
                <img src="img/book.webp" alt="${book.title}">
            </a>
            <div>
                <h3><a href="view_book.html?id=${book.book_id}" aria-label="Read more about ${book.title}">${book.title}</a></h3>
                <p>${book.author}</p>
            </div>
        `;

        booksContainer.appendChild(bookCard);
    };

    // Function to fetch and render books
    const fetchBooks = () => {
        fetch(`${baseUrl}/books?n=${numBooks}`) // Fetch random books
            .then(handleAPIError)
            .then(data => {
                data.forEach(renderBook); // Render each book
            })
            .catch(error => {
                booksContainer.innerHTML = `
                    <h3>Error</h3>
                    <p>There was an error fetching books.</p>
                    <p class="error">${error.message}</p>
                `;
            });
    };

    // Initial fetch of books
    fetchBooks();

    // Add event listener to "Load More" button if it exists
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', fetchBooks);
    }
};
