import { baseUrl, handleAPIResponseError } from "./common.js";

const profile = document.querySelector(".profile_info");
let profileInfo = {};

document.addEventListener("DOMContentLoaded", showProfile)

function showProfile() {
    let userId = sessionStorage.getItem("user_id");
    console.log(`User id ${userId}`);

    if (!userId) {
        window.location.href = "login.html";
    }
    else {
        fetch(`${baseUrl}/users/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                if (Object.keys(data).includes("first_name")) {
                    profile.innerHTML = `
                    <h2>Hi, ${data.first_name} ${data.last_name}</h2>
                    <p>Bookie member since: ${data.membership_date}</p>
                    <h3>Your information</h3>
                    <div id="form">
                        <form id="profile-form">
                            <div class="input-group">
                                <input id="editEmail" type="email" value="${data.email}">
                                <label for="editEmail">Email</lavel>
                            </div>
                            <div class="input-group">
                                <input id="editPhoneNumber" type="text" value="${data.phone_number}">
                                <label for="editPhoneNumber">Phone number</lavel>
                            </div>
                            <div class="input-group">
                                <input id="editAddress" type="text" value="${data.address}">
                                <label for="editAddress">Address</lavel>
                            </div>
                            <div class="input-group">
                                <input id="editBirth" type="text" value="${data.birth_date}">
                                <label for="editBirth">Birthday</lavel>
                            </div>
                            <button id="saveBtn" class="filled-btn" type="submit">Save changes</button>
                        </form>
                    </div>
                    `;
                    profileInfo = data;
                    document
                        .querySelector("#profile-form")
                        .addEventListener("submit", (e) => {
                            e.preventDefault();
                            updateProfile(userId);
                        });
                } else {
                    handleAPIResponseError(data.error);
                }
        }).catch(handleAPIResponseError);
}}; 

function updateProfile(userId) {
    const currentProfileInfo = {
        email: document.querySelector("#editEmail").value.trim(),
        phone_number: document.querySelector("#editPhoneNumber").value.trim(),
        address: document.querySelector("#editAddress").value.trim(),
        birth_date: document.querySelector("#editBirth").value.trim()
    };

    const params = new URLSearchParams();

    // comparing current info with original and setting it in updated info - only the changed inputs
    const updatedProfileInfo = {};
    for (let key in currentProfileInfo) {
        if (currentProfileInfo[key] !== profileInfo[key]) {
            updatedProfileInfo[key] = currentProfileInfo[key];
            params.append(key, updatedProfileInfo[key]);
            // console.log(updatedProfileInfo);
        }
    }

    // sennds message if trying to save changes without any made - TODO: maybe dissable btn if this
    if (Object.keys(updatedProfileInfo).length === 0) {
        alert("No changes made");
        return;
    }

    fetch(`${baseUrl}/users/${userId}`, {
        method: "PUT",
        body: params,
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "ok") {
                alert("Update was successful");
            } else {
                handleAPIResponseError(data.error);
                console.log("Request body:", JSON.stringify(updatedProfileInfo));
            }
        })
        .catch(handleAPIResponseError);
};
