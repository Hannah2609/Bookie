import { baseUrl, handleAPIError, handleAPIResponseError } from "./common.js";

document.addEventListener("DOMContentLoaded", showAdminProfile);
const admin = document.querySelector(".profile-info");
const authorSearch = document.getElementById("authorSearch");
const publisherSearch = document.getElementById("publisherSearch");
const authorSuggestions = document.getElementById("authorSuggestions");
const publisherSuggestions = document.getElementById("publisherSuggestions");

let authors = [];

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
                        
                        <div id="form">
                        <div>
                            <h1>Hi, ${data.first_name} ${data.last_name}</h1>
                            <button id="adminSignOut" class="filled-btn" onclick="signOut()">Sign out</button>
                        </div>
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
                                    <input id="publishingYear" type="text" placeholder="Publishing year" required>
                                    <label for="publishingYear">Publishing year *</label>  
                                </div>
                                <button class="filled-btn" type="submit">Add Book</button>
                            </form>
                        </div>
                    `;
                document.querySelector("#add-book-form").addEventListener("submit", (e) => {
                    e.preventDefault();
                    addBook(e);
                })
            document
                .querySelector("#authorSearch")
                .addEventListener("input", fetchAuthors);
        } else {
        handleAPIResponseError(data.error);
        }
    })
    .catch(handleAPIResponseError);
}
}

const fetchAuthors = () => {
    fetch(`${baseUrl}/authors`)
        .then((response) => response.json())
        .then((data) => {
        if (data) {
          // Sort authors alphabetically by name
            authors = data.sort((a, b) =>
            a.author_name.localeCompare(b.author_name))
            authorSuggestions.innerHTML = authors.map(author => `<li data-id="${author.author_id}">${author.author_name}</li>`).join("");
            console.log("fetching authors");
          // Render suggestions
            searchSuggestion();
        } else {
            handleAPIResponseError(data.error);
        }
    })
    .catch(handleAPIResponseError);
};

// function searchSuggestion() {
// console.log("suggestions")

// authorSearch.addEventListener("input", () => {
//     const authorSearchValue = authorSearch.value.trim();
//     if (authorSearchValue.length > 1) {
//             authorSuggestions.innerHTML = data`
//                 <p>${author.author_name}</p>;
//             `;
//     }
// });

// }


// ADD BOOK POST FUNCTION /

function addBook(e) {

// getting input values
const authorId = e.target.authorSearch.value.trim();
const publisherId = e.target.publisherSearch.value.trim();
const title = e.target.title.value.trim();
const year = e.target.publishingYear.value.trim();

// append values to URL params
const params = new URLSearchParams();
params.append("title", title);
params.append("author_id", authorId);
params.append("publishing_year", year);
params.append("publisher_id", publisherId);

fetch(`${baseUrl}/admin/books`, {
    method: "POST",
    body: params,
    })
    .then((response) => response.json())
    .then((data) => {
        if (Object.keys(data).includes("book_id")) {
            alert("Book added successfully");
            console.log(`book added with id${data.book_id}`);
            //reset form
        } else {
            handleAPIResponseError(data.error);
            }
        })
    .catch(handleAPIResponseError);
};