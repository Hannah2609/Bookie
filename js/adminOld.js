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
                                <fieldset>
                                    <legend>Author</legend>
                                    <div class="input-group">
                                        <input id="authorSearch" type="text" placeholder="Search author" autocomplete="off">
                                        <ul id="authorSuggestions" class="suggestions"></ul>
                                        <button type="button" id="addAuthorBtn" class="secondary-btn">Add New Author</button>
                                    </div>
                                </fieldset>
                                <fieldset>
                                    <legend>Publisher</legend>
                                    <div class="input-group">
                                        <input id="publisherSearch" type="text" placeholder="Search publisher" autocomplete="off">
                                        <ul id="publisherSuggestions" class="suggestions"></ul>
                                        <button type="button" id="addPublisherBtn" class="secondary-btn">Add New Publisher</button>
                                    </div>
                                </fieldset>
                                <div class="input-group">
                                    <input id="publishingYear" type="number" placeholder="Publishing year" required>
                                    <label for="publishingYear">Publishing year *</label>  
                                </div>
                                <button class="filled-btn" type="submit">Add Book</button>
                            </form>
                        </div>
                    `;
            setupDynamicSuggestions();
        } else {
        handleAPIResponseError(data.error);
        }
    })
    .catch(handleAPIResponseError);
}
}

function setupDynamicSuggestions() {
const authorSearch = document.getElementById("authorSearch");
const publisherSearch = document.getElementById("publisherSearch");
const authorSuggestions = document.getElementById("authorSuggestions");
const publisherSuggestions = document.getElementById("publisherSuggestions");

authorSearch.addEventListener("input", () => {
    const query = authorSearch.value.trim();
    if (query.length > 1) {
        fetch(`${baseUrl}/authors?s=${query}`)
            .then((response) => response.json())
            .then((data) => {
                authorSuggestions.innerHTML = data
                    .map(author => `<li data-id="${author.author_id}">${author.author_name}</li>`)
                    .join("");
            })
            .catch(handleAPIResponseError);
    }
});

// Handle suggestion click
document.addEventListener("click", (e) => {
    if (e.target.tagName === "LI" && e.target.parentElement === authorSuggestions) {
        authorSearch.value = e.target.textContent;
        authorSearch.dataset.id = e.target.getAttribute("data-id");
        authorSuggestions.innerHTML = ""; // Clear suggestions
    }
});

// Handle "Add New Author" button
addAuthorBtn.addEventListener("click", () => {
    const firstName = prompt("Enter author's first name:");
    const lastName = prompt("Enter author's last name:");

    if (!firstName || !lastName) {
        alert("Author details cannot be empty.");
        return;
    }
    // Send request to create a new author
        fetch(`${baseUrl}/admin/authors`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ first_name: firstName, last_name: lastName }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.author_id) {
                    alert(`Author added successfully: ${firstName} ${lastName}`);
                    // Update the search field with the new author
                    authorSearch.value = `${firstName} ${lastName}`;
                    authorSearch.dataset.id = data.author_id;
                    authorSuggestions.innerHTML = ""; // Clear suggestions
                } else {
                    handleAPIResponseError(data.error);
                }
            })
            .catch(handleAPIResponseError);
    });


publisherSearch.addEventListener("input", () => {
    const query = publisherSearch.value.trim();
    if (query.length > 1) {
    fetch(`${baseUrl}/publishers?s=${query}`)
        .then((response) => response.json())
        .then((data) => {
        publisherSuggestions.innerHTML = data
            .map(
            (publisher) =>
                `<li data-id="${publisher.publisher_id}">${publisher.publisher_name}</li>`
            )
            .join("");
        })
        .catch(handleAPIResponseError);
    }
});

document.addEventListener("click", (e) => {
    if (
    e.target.tagName === "LI" &&
    e.target.parentElement === authorSuggestions
    ) {
    authorSearch.value = e.target.textContent;
    authorSearch.dataset.id = e.target.getAttribute("data-id");
    authorSuggestions.innerHTML = ""; // Clear suggestions
    }

    if (
    e.target.tagName === "LI" &&
    e.target.parentElement === publisherSuggestions
    ) {
    publisherSearch.value = e.target.textContent;
    publisherSearch.dataset.id = e.target.getAttribute("data-id");
    publisherSuggestions.innerHTML = ""; // Clear suggestions
    }
});

document.getElementById("add-book-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const authorId = authorSearch.dataset.id;
    const publisherId = publisherSearch.dataset.id;
    const publishingYear = document.getElementById("publishingYear").value;

    if (!authorId || !publisherId) {
    alert("Please select a valid author and publisher.");
    return;
    }

    fetch(`${baseUrl}/admin/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        title,
        author_id: authorId,
        publisher_id: publisherId,
        publishing_year: publishingYear,
    }),
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.book_id) {
        alert("Book added successfully!");
        document.getElementById("add-book-form").reset();
        } else {
        handleAPIResponseError(data.error);
        }
    })
    .catch(handleAPIResponseError);
});
}
