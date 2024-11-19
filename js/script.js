document.addEventListener("DOMContentLoaded", () => {
    console.log("check for user logged in")
    const loggedInUser = sessionStorage.getItem("user_id");
    const logInBtn = document.querySelector("#loginBtn")
    const profileBtn = document.querySelector("#profileBtn");
    const adminBtn = document.querySelector("#adminBtn");

    if (loggedInUser) {
        profileBtn.classList.remove("hidden");
        logInBtn.classList.add("hidden");

        if (loggedInUser === "2679") {
                profileBtn.classList.add("hidden");
                logInBtn.classList.add("hidden");
                adminBtn.classList.remove("hidden");
        }

        // add another if statement if admin user found
    } else {
        profileBtn.classList.add("hidden");
        logInBtn.classList.remove("hidden");
    }
});


function toggleMenu() {
    const navLinks = document.querySelector(".nav-links");
    const burgerMenu = document.querySelector(".burger-menu"); 

    navLinks.classList.toggle("show");
    burgerMenu.classList.toggle("close");
}

function signOut() {
    console.log("signOut")
    sessionStorage.removeItem("user_id");
    window.location.href = "login.html";
}


