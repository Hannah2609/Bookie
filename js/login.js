import { baseUrl, handleAPIResponseError } from "./common.js";

document.querySelector('#login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    const params = new URLSearchParams();
    params.append("email", email);
    params.append("password", password);

    fetch(`${baseUrl}/users/login`, {
    method: "POST",
    body: params,
    })
    .then((response) => response.json())
    .then((data) => {
        if (Object.keys(data).includes("user_id")) {
        alert("Login was successful");
        sessionStorage.setItem("user_id", data.user_id);
        console.log(data.user_id);
        window.location.href = "profile.html";
        } else {
        handleAPIResponseError(data.error);
        }
    })
    .catch(handleAPIResponseError);

});