import { baseUrl, handleAPIError } from './common.js';

export const fetchBooks = (numBooks, showMoreBtnSelector = null, searchFieldSelector = null) => {
    const booksContainer = document.querySelector("#books");
    const showMoreBtn = showMoreBtnSelector ? document.querySelector(showMoreBtnSelector) : null;
    const searchField = searchFieldSelector ? document.querySelector(searchFieldSelector) : null;

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

    // Function to fetch random books
    const fetchRandomBooks = () => {
        fetch(`${baseUrl}/books?n=${numBooks}`) // Fetch random books
            .then(handleAPIError)
            .then(data => {
                data.forEach(renderBook); // Render each book
            })
            .catch(error => {
                booksContainer.innerHTML = `
                    <h3>Error</h3>
                    <p>There was an error fetching random books.</p>
                    <p class="error">${error.message}</p>
                `;
            });
    };

    // Function to fetch books based on a search term
    const fetchBooksBySearch = (searchTerm) => {
        // Fetch books matching the search term
        fetch(`${baseUrl}/books?s=${searchTerm}`) 
            .then(handleAPIError)
            .then(data => {
                // Clear existing books
                booksContainer.innerHTML = ''; 
                if (data.length > 0) {
                    data.forEach(renderBook); 
                } else {
                    booksContainer.innerHTML = `<p>No books found matching "${searchTerm}".</p>`;
                }

                // Hide the "Show More" button while searching
                if (showMoreBtn) {
                    showMoreBtn.classList.add('hidden');
                }
            })
            .catch(error => {
                booksContainer.innerHTML = `
                    <h3>Error</h3>
                    <p>There was an error fetching books.</p>
                    <p class="error">${error.message}</p>
                `;
            });
    };

    if (searchField) {
        searchField.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim();
            if (searchTerm === "") {
                // Clear container if search is empty
                booksContainer.innerHTML = ''; 
                fetchRandomBooks(); 
                if (showMoreBtn) {
                    showMoreBtn.classList.remove('hidden');
                }
            } else {
                // Fetch books based on search term
                fetchBooksBySearch(searchTerm); 
            }
        });
    }

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', fetchRandomBooks);
    }

    fetchRandomBooks();
};
