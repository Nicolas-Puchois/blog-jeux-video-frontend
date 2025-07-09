import { AuthManager } from "../../services/auth.js";

// Fonction pour gérer l'affichage des éléments en fonction du rôle
const handleRoleBasedDisplay = () => {
  const isLoggedIn = AuthManager.getUser();
  const isAdmin = AuthManager.isAdmin();

  // Sélectionne tous les éléments avec la classe user-role
  const roleElements = document.querySelectorAll(".user-role");

  roleElements.forEach((element) => {
    // Par défaut, on cache les éléments réservés aux rôles
    element.style.display = "none";

    // Vérifie les différentes conditions d'affichage
    if (element.classList.contains("admin-only")) {
      // Éléments réservés aux administrateurs
      if (isLoggedIn && isAdmin) {
        element.style.display = "inline-block";
      }
    } else if (element.classList.contains("user-only")) {
      // Éléments réservés aux utilisateurs connectés
      if (isLoggedIn) {
        element.style.display = "inline-block";
      }
    } else if (element.classList.contains("author-only")) {
      // Éléments réservés aux auteurs (admins)
      if (isLoggedIn && isAdmin) {
        element.style.display = "inline-block";
      }
    } else {
      // Par défaut, les éléments user-role sont visibles pour les admins
      if (isLoggedIn && isAdmin) {
        element.style.display = "inline-block";
      }
    }

    // Gestion des clics sur les éléments protégés
    element.addEventListener("click", (e) => {
      if (!isLoggedIn) {
        e.preventDefault();
        // Stocke l'URL actuelle pour la redirection après connexion
        const currentPath = window.location.pathname;
        localStorage.setItem(
          "showNotification",
          "Vous devez être connecté pour accéder à cette fonctionnalité"
        );
        window.location.href = `/login?redirect=${encodeURIComponent(
          currentPath
        )}`;
      } else if (
        !isAdmin &&
        (element.classList.contains("admin-only") ||
          element.classList.contains("author-only"))
      ) {
        e.preventDefault();
        localStorage.setItem(
          "showNotification",
          "Cette fonctionnalité est réservée aux administrateurs"
        );
      }
    });
  });
};

// Exécute la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", handleRoleBasedDisplay);

// Réexécute la fonction si l'état de connexion change
window.addEventListener("storage", (e) => {
  if (e.key === "JWTtoken" || e.key === "user") {
    handleRoleBasedDisplay();
  }
});
