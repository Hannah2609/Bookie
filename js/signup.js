import { baseUrl, handleAPIResponseError } from "./common.js";

document.querySelector('#signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const repeatPassword = e.target.repeatPassword.value.trim();
    const address = e.target.address.value.trim();
    const phoneNumber = e.target.phoneNumber.value.trim();
    const birthDate = e.target.birthDate.value.trim();

    if (password !== repeatPassword) {
        alert("Passwords must match");
        return false;
    }

    const params = new URLSearchParams();
    params.append("email", email);
    params.append("first_name", firstName);
    params.append("last_name", lastName);
    params.append("password", password);
    params.append("address", address);
    params.append("phone_number", phoneNumber);
    params.append("birth_date", birthDate);


    fetch(`${baseUrl}/users`, {
        method: "POST",
        body: params,
    })
    .then((response) => response.json())
    .then((data) => {
        if (Object.keys(data).includes("user_id")) {
            alert("Signup was successful");
            console.log(data.user_id);
            window.location.href = "login.html";
        } else {
            handleAPIResponseError(data.error);
        }
    })
    .catch(handleAPIResponseError);


});