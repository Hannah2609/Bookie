import { baseUrl, handleAPIError } from './common.js';

const bookInfoSection = document.querySelector('#book-info');

let bookID = new URLSearchParams(window.location.search);
bookID = bookID.get('id');

const viewBook = (book) => {
    let bookInfo = `
        <img src="${book.cover}" alt="${book.title}">
        <section>
            <div id="titles">
                <h1>${book.title}</h1>
                <h2>${book.author}</h2>
                <p>E-book</p>
            </div>
            <div id="released">
                <p>Released:</p>
                <p>${book.publishing_year}</+>
            </div>
            <div id="published_by">
                <p>Published by:</p>
                <p>${book.publishing_company}</p>
            </div>
            <button>Loan Book</button>
        </section>
            
    `;
    
    bookInfoSection.innerHTML = bookInfo; 
};

fetch(`${baseUrl}/books/${bookID}`)
.then(handleAPIError)
.then(viewBook)
.catch((error) => {
    bookInfoSection.innerHTML = `
        <h3>Error</h3>
        <p>Dear user, we are truly sorry to inform that there was an error while getting the data</p>
        <p class="error">${error}</p>
    `;
})