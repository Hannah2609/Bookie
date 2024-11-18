import { baseUrl, handleAPIResponseError } from "./common.js";

const profileInfo = document.querySelector(".profile_info");

document.addEventListener("DOMContentLoaded", showProfile)

function showProfile() {
    let userId = sessionStorage.getItem("user_id");
    console.log(`profile id ${userId}`);

    if (!userId) {
        window.location.href = "login.html";
    }
    else {
        fetch(`${baseUrl}/users/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                if (Object.keys(data).includes("first_name")) {
                    profileInfo.innerHTML = `
                    <h2>Hi, ${data.first_name} ${data.last_name}</h2>
                    <p>Bookie member since: ${data.membership_date}</p>
                    <h3>Your information</h3>
                    <div id="form">
                        <form id="profile-form">
                            <input id="editEmail" type="email" placeholder="${data.email}">
                            <input id="editPhoneNumber" type="text" placeholder="${data.phone_number}">
                            <input id="editAddress" type="text" placeholder="${data.address}">
                            <input id="editBirth" type="text" placeholder="${data.birth_date}">
                            <button class="filled-btn" type="submit">Save changes</button>
                        </form>
                    </div>

                    `;
                } else {
                    handleAPIResponseError(data.error);
                }
        }).catch(handleAPIResponseError);

}}; 