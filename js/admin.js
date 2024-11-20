import { baseUrl, handleAPIResponseError } from "./common.js";

document.addEventListener("DOMContentLoaded", showAdminProfile);
const admin = document.querySelector(".profile-info");


function showAdminProfile() {
const userId = sessionStorage.getItem("user_id");
if (!userId) {
    window.location.href = "login.html";
} else {
    fetch(`${baseUrl}/users/${userId}`)
    .then((response) => response.json())
    .then((data) => {
        if (Object.keys(data).includes("first_name")) {
        admin.innerHTML = `
                        <h1>Hi, ${data.first_name} ${data.last_name}</h1>
                        <button class="filled-btn" onclick="signOut()">Sign out</button>
                        <div id="form">
                            <h2>Add a New Book</h2>
                            <form id="add-book-form">
                                <div class="input-group">
                                    <input id="title" type="text" placeholder="Book title" required>
                                    <label for="title">Book Title *</label>      
                                </div> 
                                <fieldset class="fieldsetAddBook">
                                    <div class="input-group">
                                        <input id="authorSearch" type="text" placeholder="Search author" value="">
                                        <label for="authorSearch">Search Author *</label> 
                                    </div>
                                        <div id="authorSuggestions" class="suggestions"></div>
                                        <button type="button" id="addAuthorBtn" class="border-btn">Add New Author</button>
                                </fieldset>
                                <fieldset class="fieldsetAddBook">
                                    <div class="input-group">
                                        <input id="publisherSearch" type="text" placeholder="Search publisher" value""> 
                                        <label for="publisherSearch">Search publisher *</label>         
                                    </div>  
                                        <div id="publisherSuggestions" class="suggestions"></div>
                                        <button type="button" id="addPublisherBtn" class="border-btn">Add New Publisher</button>
                            
                                </fieldset>
                                <div class="input-group">
                                    <input id="publishingYear" type="number" placeholder="Publishing year" required>
                                    <label for="publishingYear">Publishing year *</label>  
                                </div>
                                <button class="filled-btn" type="submit">Add Book</button>
                            </form>
                        </div>
                    `;
            // setupDynamicSuggestions();
        } else {
        handleAPIResponseError(data.error);
        }
    })
    .catch(handleAPIResponseError);
}
}
