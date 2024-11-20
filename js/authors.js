import { baseUrl, handleAPIError } from './common.js';

const authorsContainer = document.querySelector('#authors');
const showMoreBtn = document.querySelector("#show-more");
const searchField = document.querySelector("#search");

let allAuthors = []; 
let currentPage = 0; 
const authorsPerPage = 20; 

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
            // Sort authors alphabetically by name
            allAuthors = data.sort((a, b) => a.author_name.localeCompare(b.author_name));

            // Render the first batch of authors
            showAuthorsBatch();

            // Show the "Show More" button if more authors exist
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

// Function to show a batch of authors
const showAuthorsBatch = () => {
    const startIndex = currentPage * authorsPerPage; 
    const endIndex = startIndex + authorsPerPage; 

    const authorsToShow = allAuthors.slice(startIndex, endIndex);
    authorsToShow.forEach(renderAuthor);

    // Hide the "Show More" button if all authors are displayed
    if (endIndex >= allAuthors.length) {
        showMoreBtn.classList.add('hidden');
    }
};

// Function to filter authors based on a search
const searchAuthors = (searchTerm) => {
    const filteredAuthors = allAuthors.filter(author =>
        author.author_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Clear the existing authors
    authorsContainer.innerHTML = ''; 

    if (filteredAuthors.length > 0) {
        filteredAuthors.forEach(renderAuthor);
        showMoreBtn.classList.add('hidden'); 
    } else {
        authorsContainer.innerHTML = `<p>No authors found matching "${searchTerm}".</p>`;
    }
};

searchField.addEventListener('input', (e) => {
    // Get the search input value
    const searchTerm = e.target.value.trim(); 
    if (searchTerm === "") {
        // If search field is empty, reset to the full list
        authorsContainer.innerHTML = '';
        currentPage = 0; 
        showAuthorsBatch();
        showMoreBtn.classList.remove('hidden'); 
    } else {
        // Perform the search
        searchAuthors(searchTerm);
    }
});

showMoreBtn.addEventListener('click', () => {
    currentPage++; 
    showAuthorsBatch(); 
});

fetchAuthors();
