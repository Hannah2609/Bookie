// URL
export const baseUrl = 'http://localhost:8080';

// Function to handle API error
export const handleAPIError = function(response) {
    if (response.ok) {
        return response.json();
    }
    console.log('There was an error');
}

export const handleAPIResponseError = (error = 'Generic error') => {
        showMessage(error, 'error');
}


// success & error messages
export const showMessage = function(message, type = "success", target = "main", duration = 2000,) {
    const messageContainer = document.querySelector(
        `#messageContainer-${target}`
    );

    messageContainer.textContent = message;
    messageContainer.className = ""; 
    messageContainer.classList.add(type === "error" ? "error" : "success");
    messageContainer.classList.remove("hidden");
    messageContainer.style.opacity = "1";

    // Only timeout for success messages
    if (type === "success") {
        setTimeout(() => {
            messageContainer.style.opacity = "0"; // Fade out
            setTimeout(() => {
                messageContainer.classList.add("hidden");
            }, 500);
        }, duration);
    }
}
