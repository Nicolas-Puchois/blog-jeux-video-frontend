document.addEventListener("DOMContentLoaded", () => {
  const burgerButton = document.querySelector(".toggle");
  const navLinks = document.querySelector(".nav-links");

  burgerButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    burgerButton.setAttribute(
      "aria-expanded",
      navLinks.classList.contains("active")
    );
  });

  // Fermer le menu si on clique en dehors
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".navbar") && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      burgerButton.setAttribute("aria-expanded", "false");
    }
  });
});
