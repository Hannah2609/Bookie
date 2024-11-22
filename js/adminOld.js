import { baseUrl, handleAPIResponseError } from "./common.js";

document.addEventListener("DOMContentLoaded", showAdminProfile);
const admin = document.querySelector(".add-book");


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
                                        <div id="authorSuggestions" class="suggestions hidden"></div>
                                        <button type="button" id="addAuthorBtn" class="border-btn">Add New Author</button>
                                </fieldset>
                                <fieldset class="fieldsetAddBook">
                                    <div class="input-group">
                                        <input id="publisherSearch" type="text" placeholder="Search publisher" value""> 
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
            setupSuggestions();
        } else {
        handleAPIResponseError(data.error);
        }
    })
    .catch(handleAPIResponseError);
}
}

function setupSuggestions() {
    const authorSearch = document.getElementById("authorSearch");
    const publisherSearch = document.getElementById("publisherSearch");
    const authorSuggestions = document.getElementById("authorSuggestions");
    const publisherSuggestions = document.getElementById("publisherSuggestions");

    // author searchs suggestions
    authorSearch.addEventListener("input", () => {
        const search = authorSearch.value.trim().toLowerCase(); // Convert to lowercase for matching
        if (search.length > 0) {
        fetch(`${baseUrl}/authors`)
            .then((response) => response.json())
            .then((data) => {
            // Filter the authors based on the query
            const filteredAuthors = data.filter((author) =>
                author.author_name.toLowerCase().startsWith(search)
            );

            authorSuggestions.classList.remove("hidden");

            // Map the filtered results to list items and update suggestions
            authorSuggestions.innerHTML = filteredAuthors
                .map(
                (author) =>
                    `<li data-id="${author.author_id}">${author.author_name}</li>`
                )
                .join("");

            // Handle no matches found
            if (filteredAuthors.length === 0) {
                authorSuggestions.innerHTML = `<li class="no-match">No authors found</li>`;
            }
            })
            .catch(handleAPIResponseError);
        } else {
        // Clear suggestions if the query is too short
        authorSuggestions.innerHTML = "";
        authorSuggestions.classList.add("hidden");
        }
    });

    // Handle authtor click
    document.addEventListener("click", (e) => {
        if (
        e.target.tagName === "LI" &&
        e.target.parentElement === authorSuggestions
        ) {
        authorSearch.value = e.target.textContent;
        authorSearch.dataset.id = e.target.getAttribute("data-id");
        authorSuggestions.classList.add("hidden");
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
            authorSuggestions.classList.add("hidden");
            authorSuggestions.innerHTML = ""; // Clear suggestions
            } else {
            handleAPIResponseError(data.error);
            }
        })
        .catch(handleAPIResponseError);
    });



    // publisher search suggestions
    publisherSearch.addEventListener("input", () => {
        const search = publisherSearch.value.trim();
        if (search.length > 0) {
        fetch(`${baseUrl}/publishers`)
            .then((response) => response.json())
            .then((data) => {
            // Filter the publisher based on the search
            const filteredPublishers = data.filter((publisher) =>
                publisher.publisher_name.toLowerCase().startsWith(search)
            );

            publisherSuggestions.classList.remove("hidden");

            // Map the filtered results to list items and update suggestions
            publisherSuggestions.innerHTML = filteredPublishers
                .map(
                (publisher) =>
                    `<li data-id="${publisher.publisher_id}">${publisher.publisher_name}</li>`
                )
                .join("");

            // Handle no matches found
            if (filteredPublishers.length === 0) {
                publisherSuggestions.innerHTML = `<li class="no-match">No publisher found</li>`;
            }
            })
            .catch(handleAPIResponseError);
        } else {
        // Clear suggestions if the query is too short
        publisherSuggestions.innerHTML = "";
        publisherSuggestions.classList.add("hidden");
        }
    });

    // Handle publisher click
    document.addEventListener("click", (e) => {
        if (
        e.target.tagName === "LI" &&
        e.target.parentElement === authorSuggestions
        ) {
        authorSearch.value = e.target.textContent; // insert selected author into input field
        authorSearch.dataset.id = e.target.getAttribute("data-id"); // get selected author id
        authorSuggestions.classList.add("hidden");
        authorSuggestions.innerHTML = ""; // Clear suggestions
        }

        if (
        e.target.tagName === "LI" &&
        e.target.parentElement === publisherSuggestions
        ) {
        publisherSearch.value = e.target.textContent;
        publisherSearch.dataset.id = e.target.getAttribute("data-id");
        publisherSuggestions.classList.add("hidden");
        publisherSuggestions.innerHTML = "";
        } else {
        authorSuggestions.classList.add("hidden");
        authorSuggestions.innerHTML = "";
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

        // if (!authorId || !publisherId) {
        // alert("Please select a valid author and publisher.");
        // return;
        // }

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
    });
}
