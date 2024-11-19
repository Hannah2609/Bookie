import { baseUrl, handleAPIResponseError } from "./common.js";

const admin = document.querySelector(".profile-info");

let userId = sessionStorage.getItem("user_id");
console.log(`User id ${userId}`);

document.addEventListener("DOMContentLoaded", showAdminProfile);

function showAdminProfile() {
    if (!userId) {
        window.location.href = "login.html";
    }
    else {
        fetch(`${baseUrl}/users/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                if (Object.keys(data).includes("first_name")) {
                    admin.innerHTML = `
                        <h1>Hi, ${data.first_name} ${data.last_name}</h1>
                        <button class="filled-btn" onclick="signOut()">Sign out</button>
                    `;

                    // document
                    //     .querySelector("#profile-form")
                    //     .addEventListener("submit", (e) => {
                    //         e.preventDefault();
                    //         updateProfile(userId);
                    //     });
                } else {
                    handleAPIResponseError(data.error);
                }
        }).catch(handleAPIResponseError);
}}; 

