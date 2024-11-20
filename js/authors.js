import { baseUrl, handleAPIError } from './common.js';

const authorsContainer = document.querySelector('#authors');
const showMoreBtn = document.querySelector("#show-more");

let currentPage = 0; 
const authorsPerPage = 20; 
let allAuthors = []; // We save authors in an array

// Function to render a single author
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
            // Sort by name
            allAuthors = data.sort((a, b) => a.author_name.localeCompare(b.author_name));

            // Render first page of authors
            showAuthorsBatch();

            // Show button if there is more authors to show
            if (allAuthors.length > authorsPerPage) {
                showMoreBtn.classList.remove('hidden'); 
            }
        })
        .catch((error) => {
            authorsContainer.innerHTML = `
                <h3>Error</h3>
                <p>There was an error fetching authors.</p>
                <p class="error">${error.message}</p>
            `;
        });
};

// Function to show 20 authors per page
const showAuthorsBatch = () => {
    const startIndex = currentPage * authorsPerPage; 
    const endIndex = startIndex + authorsPerPage; 

    const authorsToShow = allAuthors.slice(startIndex, endIndex);
    authorsToShow.forEach(renderAuthor);

    // If all authors shown hide button
    if (endIndex >= allAuthors.length) {
        showMoreBtn.classList.add('hidden');
    }
};

showMoreBtn.addEventListener('click', () => {
    currentPage++; // Go one page up
    showAuthorsBatch();  // Show next page
});


fetchAuthors();