// loanBook.js
import { baseUrl } from './common.js';

// Show confirmation pop-up
const showLoanConfirmation = (bookID, bookTitle, bookAuthor) => {
    // Create modal
    const modal = document.createElement('section');
    modal.id = 'loan-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Confirm Loan for 30 days</h2>
            <h3>${bookTitle}</h3>
            <h4>By: ${bookAuthor}</h4>
            <p>E-book</p>
            <div class="modal-buttons">
                <button id="cancel-loan" aria-label="Go back">Go back</button>
                <button id="confirm-loan" aria-label="Loan book">Loan book</button>
            </div>
        </div>
    `;

    // Append modal to body
    document.body.appendChild(modal);

    // Add event listeners for confirmation and cancellation
    document.querySelector('#confirm-loan').addEventListener('click', () => {
        confirmLoan(bookID);
        closeModal();
    });
    document.querySelector('#cancel-loan').addEventListener('click', closeModal);
};

// Close the modal
const closeModal = () => {
    const modal = document.querySelector('#loan-modal');
    if (modal) {
        modal.remove();
    }
};

// Confirm loan by sending the API request
const confirmLoan = (bookID) => {
    // Get user ID from session storage
    const userID = sessionStorage.getItem("user_id"); 

    fetch(`${baseUrl}/users/${userID}/books/${bookID}`, {
        method: "POST",
    })
        .then(response => response.json())
        .then((data) => {
            if (data.status === "ok") {
                window.location.href = 'loan_confirmation.html';
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

export const loanBook = (bookID, bookTitle, bookAuthor) => {
    showLoanConfirmation(bookID, bookTitle, bookAuthor);
};
