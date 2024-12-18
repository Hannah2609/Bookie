import { baseUrl, handleAPIResponseError, showMessage } from "./common.js";

// Email validation function
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        email: e.target.email.value.trim(),
        password: e.target.password.value.trim()
    };

    // Validation
    if (!formData.email || !formData.password) {
        showMessage("Email and password are required", "error", "main");
        return false;
    }

    if (!validateEmail(formData.email)) {
        showMessage("Please enter a valid email address", "error", "main");
        return false;
    }

    const params = new URLSearchParams();
    params.append("email", formData.email);
    params.append("password", formData.password);

    fetch(`${baseUrl}/users/login`, {
        method: "POST",
        body: params,
    })
    .then((response) => response.json())
    .then((data) => {
        if (Object.keys(data).includes("user_id")) {
            console.log("Login successful, user_id:", data.user_id);
            sessionStorage.setItem("user_id", data.user_id);
            
            if (data.user_id === 2679) {
                window.location.href = "admin.html";
            } else {
                window.location.href = "profile.html";
            }
        } else {
            handleAPIResponseError(data.error);
        }
    })
    .catch(handleAPIResponseError);
});
