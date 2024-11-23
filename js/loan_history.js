import { baseUrl, handleAPIError, handleAPIResponseError } from './common.js';

export const fetchLoanHistory = (bookID) => {
    return fetch(`${baseUrl}/admin/books/${bookID}`)
        .then(handleAPIError)
        .then(data => data.loans) // Return only the loans array
        .catch(error => {
            console.error("Error fetching loan history:", error);
            handleAPIResponseError(error.message);
        });
};

export const displayLoanHistory = (loans) => {
    const loanHistorySection = document.querySelector('#loan-history');
    const loansPerPage = 8;
    let currentPage = 1;

    // Sort loans by loan_date (newest first)
    loans.sort((a, b) => new Date(b.loan_date) - new Date(a.loan_date));

    // Update display based on page number
    const renderPage = (page) => {
        // Calculate start and end index
        const startIndex = (page - 1) * loansPerPage;
        const endIndex = startIndex + loansPerPage;
        const loansToDisplay = loans.slice(startIndex, endIndex);

        // Render loans on current page
        loanHistorySection.innerHTML = `
            <h3>Loan History</h3>
            ${loansToDisplay.length > 0 ? `
                <div id="loan-list">
                    <ul>
                        ${loansToDisplay.map(loan => `
                            <li><li><strong>User ID:</strong> ${loan.user_id} | <strong>Loan Date:</strong> ${loan.loan_date}</li>
                        `).join('')}
                    </ul>
                </div>
                ${loans.length > loansPerPage ? `
                    <div class="pagination">
                        <button id="prev-page" ${currentPage === 1 ? 'disabled' : ''}>Previous</button>
                        <span id="page-number">Page ${currentPage} of ${Math.ceil(loans.length / loansPerPage)}</span>
                        <button id="next-page" ${endIndex >= loans.length ? 'disabled' : ''}>Next</button>
                    </div>
                ` : ''}
            ` : `<p>No loan history available for this book.</p>`}
        `;

        // Handle event listener for the "Previous" button
        const prevPageButton = document.querySelector('#prev-page');
        prevPageButton?.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderPage(currentPage);
            }
        });

        // Handle event listener for the "Next" button
        const nextPageButton = document.querySelector('#next-page');
        nextPageButton?.addEventListener('click', () => {
            if (endIndex < loans.length) {
                currentPage++;
                renderPage(currentPage);
            }
        });
    };

    // Display first page
    renderPage(currentPage);
};



