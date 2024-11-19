import { baseUrl, handleAPIResponseError } from "./common.js";

const profile = document.querySelector(".profile-info");
const deleteProfile = document.querySelector(".delete-account");

let profileInfo = {};

let userId = sessionStorage.getItem("user_id");
console.log(`User id ${userId}`);

document.addEventListener("DOMContentLoaded", () => {
showProfile();

document.removeEventListener("click", handleClick); // Remove existing listener
document.addEventListener("click", handleClick);

function handleClick(e) {
    if (e.target && e.target.id === "editProfileBtn") {
    toggleForm(true);
    }
    if (e.target && e.target.id === "deleteBtn") {
    deleteAccount(userId);
    }
}
});


function toggleForm(enable) {
    const formFields = document.querySelectorAll("#profile-form input");
    const saveBtn = document.querySelector("#saveBtn");
    const editBtn = document.querySelector("#editProfileBtn");

    formFields.forEach((field) => {
        field.disabled = !enable; // Enable or disable fields
    });

    saveBtn.style.display = enable ? "block" : "none"; // show or hide btns
    editBtn.style.display = enable ? "none" : "block";
}

function showProfile() {
    if (!userId) {
        window.location.href = "login.html";
    }
    else {
        fetch(`${baseUrl}/users/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                if (Object.keys(data).includes("first_name")) {
                    profile.innerHTML = `
                    
                    <div id="form">
                    <div>
                        <h1>Hi, ${data.first_name} ${data.last_name}</h1>
                        <p class="membership-date">Bookie member since ${data.membership_date}</p>
                        <div class="btn-group">
                            <button class="filled-btn" onclick="signOut()">Sign out</button>
                            <button id="editProfileBtn" class="border-btn">Edit Profile</button>
                        </div>
                    </div>
                    <h2 class="profile">Your information</h2>
                        <form id="profile-form">
                            <div class="input-group">
                                <input id="editEmail" type="email" value="${data.email}" disabled>
                                <label for="editEmail">Email</lavel>
                            </div>
                            <div class="input-group">
                                <input id="editPhoneNumber" type="text" value="${data.phone_number}" disabled>
                                <label for="editPhoneNumber">Phone number</lavel>
                            </div>
                            <div class="input-group">
                                <input id="editAddress" type="text" value="${data.address}" disabled>
                                <label for="editAddress">Address</lavel>
                            </div>
                            <div class="input-group">
                                <input id="editBirth" type="text" value="${data.birth_date}" disabled>
                                <label for="editBirth">Birthday</lavel>
                            </div>
                            <button id="saveBtn" class="filled-btn" type="submit" style="display: none">Save changes</button>
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
        }
    }

    // sennds message if trying to save changes without any made - TODO: maybe dissable btn until changes been made
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
                toggleForm(false); // disable form after successfull submit
            } else {
                handleAPIResponseError(data.error);
            }
        })
        .catch(handleAPIResponseError);
};

function deleteAccount(userId) {
    console.log(`delete user with id ${userId}`);
    if (!userId) {
        alert("User ID not found. Please log in again.");
        return;
    };
    if (confirm("Are you sure you want to delete your bookie account?")) {
        fetch(`${baseUrl}/users/${userId}`, {
        method: "DELETE",
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status === "ok") {
                alert("User deleted");
                sessionStorage.removeItem("user_id");
                window.location = "index.html"
            } else {
                handleAPIResponseError(data.error);
            }
        })
        .catch(handleAPIResponseError);
    }
};

