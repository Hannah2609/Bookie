import { baseUrl, handleAPIResponseError, showMessage } from "./common.js";

document.addEventListener("DOMContentLoaded", showAdminProfile);
const admin = document.querySelector(".add-book");

// SHOW PROFILE
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
                <span id="messageContainer-main" class="hidden"></span>
                <form id="add-book-form">
                    <div class="input-group">
                    <input id="title" type="text" placeholder="Book title" required>
                    <label for="title">Book Title *</label>      
                    </div> 
                    <fieldset class="fieldsetAddBook">
                    <div class="input-group">
                        <input id="authorSearch" type="text" placeholder="Search author" value="" required>
                        <label for="authorSearch">Search Author *</label> 
                    </div>
                    <div id="authorSuggestions" class="suggestions hidden"></div>
                    <button type="button" id="addAuthorBtn" class="border-btn">Add New Author</button>
                    </fieldset>
                    <fieldset class="fieldsetAddBook">
                    <div class="input-group">
                        <input id="publisherSearch" type="text" placeholder="Search publisher" value="" required> 
                        <label for="publisherSearch">Search publisher *</label>         
                    </div>  
                    <div id="publisherSuggestions" class="suggestions hidden"></div>
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
            addBook();
            } else {
            handleAPIResponseError(data.error);
            }
        })
        .catch(handleAPIResponseError);
    }
    }



// ADD BOOK
function addBook() {
    const authorSearch = document.getElementById("authorSearch");
    const publisherSearch = document.getElementById("publisherSearch");
    const authorSuggestions = document.getElementById("authorSuggestions");
    const publisherSuggestions = document.getElementById("publisherSuggestions");

    // Author search suggestions
    authorSearch.addEventListener("input", () => {
        const search = authorSearch.value.trim().toLowerCase();
        if (search.length > 0) {
        fetch(`${baseUrl}/authors`)
            .then((response) => response.json())
            .then((data) => {
            const filteredAuthors = data.filter((author) =>
                author.author_name.toLowerCase().startsWith(search)
            );

            authorSuggestions.classList.remove("hidden");
            authorSuggestions.innerHTML = filteredAuthors
                .map(
                (author) =>
                    `<li data-id="${author.author_id}">${author.author_name}</li>`
                )
                .join("");

            if (filteredAuthors.length === 0) {
                authorSuggestions.innerHTML = `<li class="no-match">No authors found</li>`;
            }
            })
            .catch(handleAPIResponseError);
        } else {
        authorSuggestions.innerHTML = "";
        authorSuggestions.classList.add("hidden");
        }
    });

    // Handle author click
    document.addEventListener("click", (e) => {
        if (e.target.parentElement === authorSuggestions) {
        authorSearch.value = e.target.textContent;
        authorSearch.dataset.id = e.target.getAttribute("data-id");
        authorSuggestions.classList.add("hidden");
        authorSuggestions.innerHTML = "";
        }
    });


    // Open New Author Modal
    document.getElementById("addAuthorBtn").addEventListener("click", () => {
        authorModal(authorSearch, authorSuggestions);
    });

    // Open New Publisher Modal
    document.getElementById("addPublisherBtn").addEventListener("click", () => {
        publisherModal(publisherSearch, publisherSuggestions);
    });


    // Publisher search suggestions
    publisherSearch.addEventListener("input", () => {
        const search = publisherSearch.value.trim().toLowerCase();
        if (search.length > 0) {
        fetch(`${baseUrl}/publishers`)
            .then((response) => response.json())
            .then((data) => {
            const filteredPublishers = data.filter((publisher) =>
                publisher.publisher_name.toLowerCase().startsWith(search)
            );

            publisherSuggestions.classList.remove("hidden");
            publisherSuggestions.innerHTML = filteredPublishers
                .map(
                (publisher) =>
                    `<li data-id="${publisher.publisher_id}">${publisher.publisher_name}</li>`
                )
                .join("");

            if (filteredPublishers.length === 0) {
                publisherSuggestions.innerHTML = `<li class="no-match">No publishers found</li>`;
            }
            })
            .catch(handleAPIResponseError);
        } else {
        publisherSuggestions.innerHTML = "";
        publisherSuggestions.classList.add("hidden");
        }
    });

    // Handle publisher click
    document.addEventListener("click", (e) => {
        if (e.target.parentElement === publisherSuggestions) {
        publisherSearch.value = e.target.textContent;
        publisherSearch.dataset.id = e.target.getAttribute("data-id");
        publisherSuggestions.classList.add("hidden");
        publisherSuggestions.innerHTML = "";
        }
    });

    // Add book post request
    document.getElementById("add-book-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value.trim();
        const authorId = authorSearch.dataset.id;
        const publisherId = publisherSearch.dataset.id;
        const publishingYear = document.getElementById("publishingYear").value;

        const params = new URLSearchParams();
        params.append("title", title);
        params.append("author_id", authorId);
        params.append("publishing_year", publishingYear);
        params.append("publisher_id", publisherId);

        fetch(`${baseUrl}/admin/books`, {
        method: "POST",
        body: params,
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.book_id) {
            showMessage("Book added successfully!", "succes", "main");
            document.getElementById("add-book-form").reset();
            } else {
                showMessage(data.error, "error", "main");            
            }
        })
        .catch(error => {
            console.error(error);
            showMessage("Failed to add book", "error", 2000, "main");
        });
    });
}



// ADD AUTHOR

// Open add author modal
function authorModal(authorSearch, authorSuggestions) {
    const modal = document.createElement("dialog");
    modal.id = "modal-content";
    modal.innerHTML = `
        <div>
            <button id="close-modal" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.42-1.42L12 9.59 7.12 4.7A1 1 0 1 0 5.7 6.12L10.59 11l-4.88 4.88a1 1 0 0 0 1.42 1.42L12 12.41l4.88 4.88a1 1 0 0 0 1.42-1.42L13.41 11l4.88-4.88z"/>
                </svg>
            </button>
        </div>
        <form id="add-author-form">
            <h2>Add a new author</h2>
            <div class="input-group">
                <input id="firstName" type="text" placeholder="First name" required>
                <label for="firstName">First Name *</label>
            </div>
            <div class="input-group">
                <input id="lastName" type="text" placeholder="Last name" required>
                <label for="lastName">Last Name *</label>
            </div>
            <span id="messageContainer-author" class="hidden"></span>
            <button type="submit" class="filled-btn">Add new Author</button>
        </form>
    `;

    document.body.appendChild(modal);
    modal.showModal();

    document.getElementById("close-modal").addEventListener("click", () => closeModal(modal));
    document.getElementById("add-author-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();

        addNewAuthor(firstName, lastName, modal, authorSearch, authorSuggestions);
    });
}
// POST new author
function addNewAuthor(firstName, lastName, modal, authorSearch, authorSuggestions) {
    const params = new URLSearchParams();
    params.append("first_name", firstName);
    params.append("last_name", lastName);

    fetch(`${baseUrl}/admin/authors`, {
        method: "POST",
        body: params,
    })
        .then((response) => response.json())
        .then((data) => {
        if (data.author_id) {
            console.log(`added author: ${firstName} ${lastName} with ${data.author_id}`);
            showMessage(`Added author: ${firstName} ${lastName}`, "success", 2000, "author");
            // adding the new author to search field
            authorSearch.value = `${firstName} ${lastName}`;
            authorSearch.dataset.id = data.author_id;
            authorSuggestions.classList.add("hidden"); 
            closeModal(modal);
        } else {
            showMessage(data.error, "error", "author");
        }
        })
        .catch((error) => {
        console.error(error);
        showMessage("Failed to add author.", "error", "author");
        });
}



// ADD PUBLISHER

// Open add publisher modal
function publisherModal(publisherSearch, publisherSuggestions) {
    const modal = document.createElement("dialog");
    modal.id = "modal-content";
    modal.innerHTML = `
        <div>
            <button id="close-modal" aria-label="Close modal">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.42-1.42L12 9.59 7.12 4.7A1 1 0 1 0 5.7 6.12L10.59 11l-4.88 4.88a1 1 0 0 0 1.42 1.42L12 12.41l4.88 4.88a1 1 0 0 0 1.42-1.42L13.41 11l4.88-4.88z"/>
                </svg>
            </button>
        </div>
        <form id="add-publisher-form">
            <h2>Add a new publisher</h2>
            <div class="input-group">
                <input id="name" type="text" placeholder="Publisher name" required>
                <label for="name">Publisher name *</label>
            </div>
            <span id="messageContainer-publisher" class="hidden"></span>
            <button type="submit" class="filled-btn">Add new publisher</button>
        </form>
    `;

    document.body.appendChild(modal);
    modal.showModal();

    document.getElementById("close-modal").addEventListener("click", () => closeModal(modal));
    document.getElementById("add-publisher-form").addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();

        addNewPublisher(name, modal, publisherSearch, publisherSuggestions);
    });
}
// POST new publisher
function addNewPublisher(name, modal, publisherSearch, publisherSuggestions) {

    const params = new URLSearchParams();
    params.append("name", name);

    fetch(`${baseUrl}/admin/publishers`, {
        method: "POST",
        body: params,
    })
        .then((response) => response.json())
        .then((data) => {
        if (data.publisher_id) {
            console.log(`added publisher: ${name} with ${data.publisher_id}`);
            showMessage(`Added publisher: ${name}`, "success", "publisher");            
            // adding the new publisher to search field
            publisherSearch.value = `${name}`;
            publisherSearch.dataset.id = data.publisher_id;
            publisherSuggestions.classList.add("hidden"); 
            closeModal(modal);
        } else {
            showMessage(data.error, "error", "publisher");
        }
        })
        .catch((error) => {
        console.error(error);
        showMessage("Failed to add publisher.", "error", "publisher");
        });
}


function closeModal(modal) {
    if (modal) {
        modal.close();
        modal.remove();
    }
}
