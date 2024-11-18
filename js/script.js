function toggleMenu() {
    const navLinks = document.querySelector(".nav-links");
    const burgerMenu = document.querySelector(".burger-menu"); 

    const loggedInUser = sessionStorage.getItem("user_id");
    const logInBtn = document.querySelector("#loginBtn")
    const profileBtn = document.querySelector("#profileBtn");
    const adminBtn = document.querySelector("#adminBtn");


    navLinks.classList.toggle("show");
    burgerMenu.classList.toggle("close");
}

function signOut() {
    console.log("signOut")
}


