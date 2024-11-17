function toggleMenu() {
    const navLinks = document.querySelector(".nav-links");
    const burgerMenu = document.querySelector(".burger-menu"); 

    navLinks.classList.toggle("show");
    burgerMenu.classList.toggle("close");
}
