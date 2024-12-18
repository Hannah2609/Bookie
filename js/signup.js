import { baseUrl, handleAPIResponseError, showMessage } from "./common.js";
import { validateForm } from "./signup_validation.js";

document.querySelector('#signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        firstName: e.target.firstName.value.trim(),
        lastName: e.target.lastName.value.trim(),
        email: e.target.email.value.trim(),
        password: e.target.password.value.trim(),
        repeatPassword: e.target.repeatPassword.value.trim(),
        address: e.target.address.value.trim(),
        phoneNumber: e.target.phoneNumber.value.trim(),
        birthDate: e.target.birthDate.value.trim()
    };

    // Password match validation
    if (formData.password !== formData.repeatPassword) {
        showMessage("Passwords must match", "error", "main");
        return false;
    }

    // Form validation
    const validationErrors = validateForm(formData);
    if (validationErrors.length > 0) {
        showMessage(validationErrors.join("\n"), "error", "main");
        return false;
    }

    console.log("Password value:", formData.password);
    console.log("Checks:", {
        length: formData.password.length >= 8,
        uppercase: /[A-Z]/.test(formData.password),
        lowercase: /[a-z]/.test(formData.password),
        number: /\d/.test(formData.password),
        special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(formData.password),
    });

    const params = new URLSearchParams();
    params.append("email", formData.email);
    params.append("first_name", formData.firstName);
    params.append("last_name", formData.lastName);
    params.append("password", formData.password);
    params.append("address", formData.address);
    params.append("phone_number", formData.phoneNumber);
    params.append("birth_date", formData.birthDate);


    console.log("Params being sent:", Object.fromEntries(params));

    fetch(`${baseUrl}/users`, {
        method: "POST",
        body: params,
    })
    .then((response) => response.json())
    .then((data) => {
        if (Object.keys(data).includes("user_id")) {
            console.log(data.user_id, "- Signup successfull");
            window.location.href = "login.html";
        } else {
            handleAPIResponseError(data.error);
        }
    })
    .catch(handleAPIResponseError);


});