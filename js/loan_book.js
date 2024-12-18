import { baseUrl, showMessage } from './common.js';

// Show the loan confirmation modal
const showLoanConfirmation = (bookID, bookTitle, bookAuthor) => {
    const modal = document.createElement('dialog'); 
    modal.id = 'modal-content';
    modal.innerHTML = `
        <div>
            <button id="close-modal" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.42-1.42L12 9.59 7.12 4.7A1 1 0 1 0 5.7 6.12L10.59 11l-4.88 4.88a1 1 0 0 0 1.42 1.42L12 12.41l4.88 4.88a1 1 0 0 0 1.42-1.42L13.41 11l4.88-4.88z"/>
                </svg>
            </button>
        </div>
        <div id="modal-titles">
            <h2>Confirm Loan for 30 days</h2>
            <h3>${bookTitle}</h3>
            <h4>By: ${bookAuthor}</h4>
            <p>E-book</p>
        </div>
        <span id="messageContainer-main" class="hidden"></span>
        <div class="modal-buttons">
            <button class="border-btn" id="cancel-loan" aria-label="Go back">Go back</button>
            <button class="filled-btn" id="confirm-loan" aria-label="Loan book">Loan book</button>
        </div>
    `;

    document.body.appendChild(modal); // Append modal to the DOM
    modal.showModal(); // Show the modal

    // Add event listeners
    document.querySelector('#close-modal').addEventListener('click', () => closeModal(modal));
    document.querySelector('#cancel-loan').addEventListener('click', () => closeModal(modal));
    document.querySelector('#confirm-loan').addEventListener('click', () => {
        confirmLoan(bookID, bookTitle, modal);
    });
};

// Close the modal
const closeModal = (modal) => {
    if (modal) {
        modal.close(); 
        modal.remove(); 
    }
};

// Confirm loan
const confirmLoan = (bookID, bookTitle, modal) => {
    const userID = sessionStorage.getItem("user_id");

    fetch(`${baseUrl}/users/${userID}/books/${bookID}`, {
        method: "POST",
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "ok") {
                loanSuccess(bookTitle, modal); // Update modal on success
            } else if (data.error === "This user has still this book on loan") {
                showMessage("You have already loaned this book within the last 30 days.", "error", "main");
            } else {
                showMessage("An unexpected error occurred. Please try again later.", "error", "main" );
            }
        })
        .catch((error) => {
            showMessage(`An error occurred while trying to loan the book: ${error.message}`, "error", "main");
        });
};

// Update the modal to show success
const loanSuccess = (bookTitle, modal) => {
    modal.innerHTML = `
        <div>
            <button id="close-modal" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.42-1.42L12 9.59 7.12 4.7A1 1 0 1 0 5.7 6.12L10.59 11l-4.88 4.88a1 1 0 0 0 1.42 1.42L12 12.41l4.88 4.88a1 1 0 0 0 1.42-1.42L13.41 11l4.88-4.88z"/>
                </svg>
            </button>
        </div>
        <div id="modal-titles">
            <h2>Loan of "${bookTitle}" Confirmed!</h2>
            <p>You will receive an email with an access link to your e-book.</p>
        </div>
    `;

    modal.querySelector('#close-modal').addEventListener('click', () => closeModal(modal));
};

export const loanBook = (bookID, bookTitle, bookAuthor) => {
    showLoanConfirmation(bookID, bookTitle, bookAuthor);
};
