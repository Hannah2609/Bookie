import { fetchBooks } from './fetch_books.js';
import {baseUrl, handleAPIError} from './common.js';

fetchBooks(5); 

// Function to render a single author

const authorsContainer = document.querySelector('#authors');

const renderAuthor = (author) => {
    const authorCard = document.createElement('article');
    authorCard.innerHTML = `
        <a href="books_by_author.html?id=${author.author_id}" aria-label="See books by ${author.author_name}">
            <div id="author-card">
                <h2>${author.author_name}</h2>
            </div>
        </a>
    `;
    authorsContainer.appendChild(authorCard);
};

// Function to fetch and render all authors
const fetchAuthors = () => {
    fetch(`${baseUrl}/authors`)
        .then(handleAPIError)
        .then((data) => {
            data.slice(0, 5).forEach(renderAuthor);
        })
        .catch((error) => {
            authorsContainer.innerHTML = `
                <h3>Error</h3>
                <p>There was an error fetching authors.</p>
                <p class="error">${error.message}</p>
            `;
        });
};


fetchAuthors();