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
        alert('There was an error: ' + error);
        showMessage(error, 'error')
}

export const showMessage = function(message, type = "success", duration = 2000) {
    const messageContainer = document.querySelector("#messageContainer");

    // Indstil beskedens tekst og type
    messageContainer.textContent = message;
    messageContainer.className = ""; // Rens klasser
    messageContainer.classList.add(type === "error" ? "error" : "success");
    messageContainer.classList.remove("hidden");

    // Vis beskeden med en fade-in effekt
    messageContainer.style.opacity = "1";

    // Fjern beskeden efter den angivne varighed
    setTimeout(() => {
        messageContainer.style.opacity = "0"; // Fade out
        setTimeout(() => {
            messageContainer.classList.add("hidden");
        }, 500); // Vent på fade-out-effekten
    }, duration);
}