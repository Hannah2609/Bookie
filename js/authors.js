import { baseUrl, handleAPIError } from './common.js';

const authorsContainer = document.querySelector('#authors');
// const showMoreBtn =  document.querySelector("#show-more");

// Function to render a single book
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

// Function to fetch and render authors
const fetchAuthors = () => {
    fetch(`${baseUrl}/authors`) 
        .then(handleAPIError)
        .then((data) => {
        data.forEach(renderAuthor); // Render each author
        })
        .catch((error) => {
            authorsContainer.innerHTML = `
                <h3>Error</h3>
                <p>There was an error fetching books.</p>
                <p class="error">${error.message}</p>
            `;
    });
};

fetchAuthors()

// showMoreBtn.addEventListener('click', fetchAuthors);
