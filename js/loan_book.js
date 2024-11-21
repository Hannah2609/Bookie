import { baseUrl } from './common.js';

// Create modal
const showLoanConfirmation = (bookID, bookTitle, bookAuthor) => {
    const modal = document.createElement('section');
    modal.id = 'loan-modal';
    modal.innerHTML = `
        <div class="modal-content">
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
            <div class="modal-buttons">
                <button class="border-btn" id="cancel-loan" aria-label="Go back">Go back</button>
                <button class="filled-btn" id="confirm-loan" aria-label="Loan book">Loan book</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.querySelector('#close-modal').addEventListener('click', closeModal);
    document.querySelector('#cancel-loan').addEventListener('click', closeModal);
    document.querySelector('#confirm-loan').addEventListener('click', () => {
        confirmLoan(bookID, bookTitle, modal);
    });
};

const closeModal = () => {
    const modal = document.querySelector('#loan-modal');
    if (modal) {
        modal.remove();
    }
};

// Confirm loan
const confirmLoan = (bookID, bookTitle, modal) => {
    // Get user ID from session storage
    const userID = sessionStorage.getItem("user_id");

    fetch(`${baseUrl}/users/${userID}/books/${bookID}`, {
        method: "POST",
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "ok") {
                // Update modal on success
                loanSuccess(bookTitle, modal); 
            } else if (data.error === "This user has still this book on loan") {
                alert("You have already loaned this book within the last 30 days.");
            } else {
                alert("An unexpected error occurred. Please try again later.");
            }
        })
        .catch((error) => {
            alert(`An error occurred while trying to loan the book: ${error.message}`);
        });
};

// Update modal if success
const loanSuccess = (bookTitle, modal) => {
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = `
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

    modal.querySelector('#close-modal').addEventListener('click', closeModal);
};

export const loanBook = (bookID, bookTitle, bookAuthor) => {
    showLoanConfirmation(bookID, bookTitle, bookAuthor);
};
